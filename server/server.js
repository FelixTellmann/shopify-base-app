import express from 'express';
import path from 'path';
import createReactRoutes from './createReactRoutes';

const root = path.resolve(__dirname, '../');
const app = express();
const { NODE_ENV, PORT } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('app', createReactRoutes('app', { NODE_ENV, root }));
app.use('/', createReactRoutes('public', { NODE_ENV, root, publicPath: '/' }));

/*================ Server Startup ================*/
app.set('port', (PORT || 3000));
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});