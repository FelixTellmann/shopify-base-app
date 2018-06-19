import settings from '../config/shopify.config';
import fetch from 'node-fetch';
import Charge from './database/charge';
import Shop from './database/shop';

const { name, url, scope, auth, charge_options, charges } = settings;
const { NODE_ENV, PORT, SHOPIFY_APP_COOKIE, SHOPIFY_APP_DATABASE, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET } = process.env;


export const createCharge = async (req, res, next) => {
  const { charge_id } = req.query;
  const { access_token, profileURL, shop_id } = req.user;
  let options = {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': access_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: {}
  };
  
  if (!charge_id && req.query.type) {
    const { name, test, type, price, capped_amount, terms, trial_days } = charges[req.query.type];
    options.body = JSON.stringify({
      [type]: {
        name,
        test,
        price,
        trial_days,
        capped_amount,
        terms,
        return_url: url + '/charge'
      }
    });
    
    /*================ If there is a charge - create charge & redirect to confirmation_url ================*/
    const data = await (await fetch(`https://${profileURL}/admin/${type}s.json`, options)).json();
    const charge = await Charge.findOneAndUpdate(
      {
        id: data[type].id
      },
      {
        $setOnInsert: {
          id: data[type].id,
          type,
          [type]: {
            ...data[type]
          }
        }
      },
      {
        new: true,
        upsert: true
      }
    );
    
    await Shop.findOneAndUpdate(
      {
        shop_id: req.user.shop_id
      },
      {
        $addToSet: {
          charges: charge._id
        }
      });
    
    req.query.iframe === 'true'
      ? res.send(`<script>window.open('${charge[type].confirmation_url}', "_top")</script>`)
      : res.redirect(charge[type].confirmation_url);
    
  } else {
    const charge = await Charge.findOne({ id: charge_id });
    const { type } = charge;
    options.body = JSON.stringify({
      [type]: charge[type]
    });
    const data = await (await (await fetch(`https://${profileURL}/admin/${charge.type}s/${charge_id}/activate.json`, options)).json());
    if (data[type].status === 'active') {
      await Charge.findOneAndUpdate(
        {
          id: data[type].id
        },
        {
          [type]: {
            ...data[type]
          }
        },
        {
          new: true,
          upsert: true
        }
      );
      
      await Shop.findOneAndUpdate(
        {
          shop_URL: req.user.shop_URL
        },
        {
          charge_approved: true,
          charge_activated_date: Date.now()
        }
      );
      
      next();
    } else {
      return res.redirect('/app');
    }
  }
};


const activateCharge = async (req, res, next) => {
  
  const charge = await Charge.findOne({ id: req.query.charge_id });
  const shop = await Shop.findOne({ shop_URL: req.user.shop_URL });
  const data = await (await fetch(`https://${req.user.shop_URL}/admin/${charge.method}s/${req.query.charge_id}.json`, {
    method: 'GET',
    headers
  })).json();
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers
  };
  const activated = await (await (await fetch(`https://${req.user.shop_URL}/admin/${charge.method}s/${req.query.charge_id}/activate.json`, options)).json());
  
  if (activated[charge.method].status === 'active') {
    await Charge.findOneAndUpdate(
      {
        id: activated[Object.keys(activated)[0]].id
      },
      {
        $set: {
          id: activated[Object.keys(activated)[0]].id,
          method: Object.keys(activated)[0],
          data: { ...activated[Object.keys(activated)[0]] }
        }
      });
    
    await Shop.findOneAndUpdate(
      {
        shop_URL: req.user.shop_URL
      },
      {
        charge_approved: charge.type === shop.charge_type,
        charge_activated_date: Date.now(),
        $addToSet: {
          charges: charge._id
        }
      });
    
    next();
  } else {
    return res.redirect('/login');
  }
};


const checkCharge = async (req, res, next) => {
  const shop = await Shop.findOne({ shop_URL: req.user.shop_URL });
  const { FORCE_RENEW } = readEnv(`APP_CHARGE_${req.query.type}`, false);
  
  if (!FORCE_RENEW && shop.charge_approved) {
    res.redirect('https://' + req.user.shop_URL + '/admin/apps/' + CONFIG.KEY);
  } else {
    next();
  }
};
