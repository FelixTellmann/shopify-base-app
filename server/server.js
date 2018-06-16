import express from 'express';
import path from 'path';
import createReactRoutes from './createReactRoutes';
import nonce from 'nonce';
import passport from 'passport';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import settings from '../config/shopify.config';
import ShopifyAuthorization from './ShopifyAuthorization';


/*================ Import Models ================*/
import User from './database/user';
import Shop from './database/shop';


const root = path.resolve(__dirname, '../');
const app = express();
const { NODE_ENV, PORT, SHOPIFY_APP_COOKIE, SHOPIFY_APP_DATABASE, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET } = process.env;
const { name, url, scope, auth, charge_options, charges } = settings;

mongoose.connect(SHOPIFY_APP_DATABASE);

app.use(cookieSession({ maxAge: 7 * 24 * 60 * 60 * 1000, keys: [SHOPIFY_APP_COOKIE], httpOnly: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/*================ Passport User Identification ================*/
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  if (auth === 'per-user') { // If Online access_token is required based on user Scope Levels
    User.findById(id).then((user) => done(null, user));
  } else { // If Offline access_token is required based app requested Scope
    Shop.findById(id).then((user) => done(null, user));
  }
});

app.use('/auth', (req, res, next) => {
  const { shop, hmac, charge } = req.query;
  if (typeof shop !== 'string') {
    return res.status(400).send(`${url}/auth?shop=liquix-app-development.myshopify.com&charge=free`);
  }
  let state = nonce()();
  charge_options.map((option) => option === charge ? state += `||${charge}` : null);
  passport.use(`shopify-${state}`, new ShopifyAuthorization(shop, state, { url, scope, auth, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET }));
  passport.authenticate(`shopify-${state}`, { shop })(req, res, next);
});

app.use('/callback', (req, res, next) => {
  passport.authenticate(`shopify-${req.query.state}`)(req, res, next);
}, (req, res) => {
  passport.unuse(`shopify-${req.query.state}`);
  if (req.query.state.includes('||')) {
    return res.redirect(`/charge?type=${req.query.state.split('||')[1]}`);
  } else {
    return res.redirect(`/app`);
  }
});


app.use('/app', /*requireAuth() ,*/ createReactRoutes('app', { NODE_ENV, root, requireAuth: true }));
app.use('/', createReactRoutes('public', { NODE_ENV, root, publicPath: '/' }));

/*================ Server Startup ================*/
app.set('port', (PORT || 3000));
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});