const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const contextPath = path.resolve(__dirname, '../app/');
const buildPath = path.resolve(__dirname, '../build/app/');
extractStyles = new ExtractTextPlugin({ filename: 'static/css/index.css' });

module.exports = {
  mode: 'production',
  context: contextPath,
  // Tell webpack to begin building its
  // dependency graph from this file.
  entry: {
    'static/js/index': './index.js'
  },
  // And to place the output in the `build` directory
  output: {
    path: buildPath
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
        use: extractStyles.extract({
          fallback: 'style-loader',
          use: [
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
        })
      }
    ]
  },
  plugins: [
    extractStyles,
    new CopyWebpackPlugin([{
      ignore: [ '*.html' ],
      from: 'static',
      to: 'static'
    }]),
    new CopyWebpackPlugin([{
      from: 'static/index.html',
      to: 'static/..'
    }]),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};