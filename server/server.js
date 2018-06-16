import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpack2 from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackDevMiddleware2 from 'webpack-dev-middleware';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});



const router = express.Router();


/*router.use('*', checkAuth);*/
process.env.NODE_ENV === 'development' && router.use(webpackDevMiddleware(webpack(require('../config/webpack.app.dev.config'))));

/** Add routes above this route to create static routes*/
router.get('*', (req, res) => {
  res.send('this is the app')
});


app.use('/app', router);
const secondRouter = express.Router();

process.env.NODE_ENV === 'development' &&  secondRouter.use(webpackDevMiddleware2(webpack2(require('../config/webpack.public.dev.config'))));
secondRouter.get('*', (req, res) => {
  res.send('this is a public')
});
app.use('/public', secondRouter);

/*================ Server Startup ================*/
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});