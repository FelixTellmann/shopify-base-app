import express from 'express';
import path from 'path';
import createReactRoutes from './createReactRoutes';
import passport from 'passport';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import settings from '../config/shopify.config';
import { createAuth, verifyAuth, redirectAuth } from './ShopifyAuthorization';


/*================ Import Models ================*/
import User from './database/user';


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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/*================ Passport User Identification ================*/
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id).then((user) => done(null, user)));


app.use('/auth', createAuth, verifyAuth, redirectAuth);
app.use('/app', /*requireAuth() ,*/ createReactRoutes('app', { NODE_ENV, root, requireAuth: true }));
app.use('/', createReactRoutes('public', { NODE_ENV, root, publicPath: '/' }));

/*================ Server Startup ================*/
app.set('port', (PORT || 3000));
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});