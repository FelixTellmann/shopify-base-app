const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const contextPath = path.resolve(__dirname, '../app/');
const buildPath = path.resolve(__dirname, '../build/app/');

module.exports = {
  mode: 'development',
  context: contextPath,
  // Tell webpack to begin building its
  // dependency graph from this file.
  entry: './index.js',
  // And to place the output in the `build` directory
  output: {
    path: buildPath,
    filename: 'index.js',
    publicPath: '/app/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        /* We'll leave npm packages as is and not
           parse them with Babel since most of them
           are already pre-transpiled anyway. */
        exclude: [/node_modules/, 'static'],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /(\.css|\.scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [contextPath],
              data: '@import "variables.scss";',
              sourceMap: true,
              sourceMapContents: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'static/index.html',
      filename: 'index.html'
    }),
    new Dotenv({
      path: contextPath + '/../.env', // Path to .env file (this is the default)
      safe: false // load .env.example (defaults to "false" which does not use dotenv-safe)
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    }
  }
};