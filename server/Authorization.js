import { Strategy } from 'passport-shopify';
import User from './database/user';
import Shop from './database/shop';
import nonce from 'nonce';
import passport from 'passport/lib/index';
import settings from '../config/shopify.config';

const { NODE_ENV, PORT, SHOPIFY_APP_COOKIE, SHOPIFY_APP_DATABASE, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET } = process.env;
const { name, url, scope, auth, charge_options, charges } = settings;

class Authorization {
  constructor(shop, state, options = {}) {
    const { url, scope, auth, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET } = options;
    const ShopifyStrategy = new Strategy({
      scope,
      shop,
      clientID: SHOPIFY_APP_KEY,
      clientSecret: SHOPIFY_APP_SECRET,
      callbackURL: url + '/auth'
    }, async (accessToken, refreshToken, params, profile, done) => {
      /*================ Find or Insert Shop ================*/
      // TODO update model to be exact match to data received from shopify
      
      
      /*================ Find, Update or Insert User ================*/
      const user = await User.findOneAndUpdate(
        {
          id: params.associated_user && params.associated_user.id || profile.id
        },
        {
          id: params.associated_user && params.associated_user.id || profile.id,
          account_owner: params.associated_user && params.associated_user.account_owner || false,
          locale: params.associated_user && params.associated_user.locale || '',
          first_name: params.associated_user && params.associated_user.first_name || profile.username,
          last_name: params.associated_user && params.associated_user.last_name || '',
          email: params.associated_user && params.associated_user.email || profile.emails[0].value,
          associated_user_scope: params.associated_user_scope || params.scope,
          scope: params.scope,
          access_token: params.access_token,
          shop_id: profile.id,
          profileURL: profile.profileURL
        },
        {
          upsert: true,
          new: true,
          runValidators: true
        }
      );
      
      await Shop.findOneAndUpdate(
        {
          id: profile.id
        },
        {
          $setOnInsert: {
            charge_approved: false,
            charge_trial_days_used: 0,
            install_first_date: Date.now(),
            associated_users: [],
            charges: []
          },
          id: profile.id,
          displayName: profile.displayName,
          profileURL: profile.profileURL,
          username: profile.username,
          provider: profile.provider,
          emails: profile.emails,
          shop: profile._json.shop,
          install_current_date: Date.now()
        },
        {
          new: true,
          upsert: true
        }
      );
      
      /*================ Find Shop & AddToSet User._id ================*/
      await Shop.findOneAndUpdate(
        {
          id: profile.id
        },
        {
          $addToSet: {
            associated_users: user._id
          }
        }
      );
      return done(null, user);
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

export const createAuth = (req, res, next) => {
  const { shop, charge, hmac, code, timestamp } = req.query;
  if (typeof shop !== 'string') {
    // TODO create a polaris page with a shop input field to get started / select subscription type
    return res.status(400).send(`${url}/auth?shop=liquix-app-development.myshopify.com&charge=free`);
  }
  if (!hmac && !code && !timestamp) {
    let state = nonce()();
    charge_options.map((option) => option === charge ? state += `||${charge}` : null);
    passport.use(`shopify-${state}`, new Authorization(shop, state, { url, scope, auth, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET }));
    passport.authenticate(`shopify-${state}`, { shop })(req, res, next);
  } else {
    next();
  }
};

export const verifyAuth = (req, res, next) => {
  passport.authenticate(`shopify-${req.query.state}`)(req, res, next);
};

export const unuseAuth = (req, res, next) => {
  passport.unuse(`shopify-${req.query.state}`);
  next();
};
