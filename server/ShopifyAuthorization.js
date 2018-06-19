import { Strategy } from 'passport-shopify';
import User from './database/user';
import Shop from './database/shop';

class ShopifyAuthorization {
  constructor(shop, state, options = {}) {
    const { url, scope, auth, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET } = options;
    const ShopifyStrategy = new Strategy({
      scope,
      shop,
      clientID: SHOPIFY_APP_KEY,
      clientSecret: SHOPIFY_APP_SECRET,
      callbackURL: url + '/auth/callback'
    }, async (accessToken, refreshToken, params, profile, done) => {
      /*================ Find or Insert Shop ================*/
      console.log(profile)
      
      const shop = await Shop.findOneAndUpdate(
        {
          shop: profile.id
        },
        {
          $setOnInsert: {
            charge_approved: false,
            charge_trial_days_used: 0,
            install_first_date: Date.now(),
            users: [],
            charges: []
          },
          shop: profile.id,
          shop_URL: profile.profileURL,
          shop_name: profile.username,
          email: profile.emails[0].value,
          access_token: accessToken,
          charge_type: auth,
          scope: params.scope,
          install_current_date: Date.now()
        },
        {
          new: true,
          upsert: true
        });
      
      if (auth === 'per-user') {
        /*================ Find, Update or Insert User ================*/
        const user = await User.findOneAndUpdate(
          {
            id: params.associated_user.id
          },
          {
            id: params.associated_user.id,
            shop_URL: profile.profileURL,
            first_name: params.associated_user.first_name,
            last_name: params.associated_user.last_name,
            email: params.associated_user.email,
            associated_scope: params.associated_user_scope,
            access_token: params.access_token
          },
          {
            upsert: true,
            new: true,
            runValidators: true
          });
        
        /*================ Find Shop & AddToSet User._id ================*/
        await Shop.findOneAndUpdate(
          {
            shop: profile.id
          },
          {
            $addToSet: {
              users: user._id
            }
          });
        
        return done(null, user);
      } else {
        return done(null, shop);
      }
    });
    
    ShopifyStrategy.authorizationParams = () => {
      return {
        state,
        'grant_options[]': auth
      };
    };
    return ShopifyStrategy;
  };
}

export default ShopifyAuthorization;