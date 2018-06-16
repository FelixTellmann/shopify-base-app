import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

const createReactRoutes = (app, route, options = {}) => {
  const { NODE_ENV, root, requireAuth } = options;
  const router = express.Router();
  if (NODE_ENV === 'development') {
    router.use(webpackDevMiddleware(webpack(require(`../config/webpack.${route}.dev.config`))));
  } else {
    app.use(`/${route}/static`, express.static(`${root}/${route}/static`));
    router.get('*', (req, res) => {
      res.sendFile(`${root}/${route}/index.html`);
    });
  }
  app.use(`/${route}`, router);
};

export default createReactRoutes;