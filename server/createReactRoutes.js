import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

const createReactRoutes = (route, options = {}) => {
  const { NODE_ENV, root, publicPath, requireAuth } = options;
  const router = express.Router();
  if (NODE_ENV === 'development') {
    if (publicPath) {
      const config = require(`../config/webpack.${route}.dev.config`);
      config.output.publicPath = publicPath;
      router.use(webpackDevMiddleware(webpack(config)));
    } else {
      router.use(webpackDevMiddleware(webpack(require(`../config/webpack.${route}.dev.config`))));
    }
  } else {
    router.use(`/static`, express.static(`${root}/${route}/static`));
    router.get('*', (req, res) => {
      res.sendFile(`${root}/${route}/index.html`);
    });
  }
  return router;
};

export default createReactRoutes;