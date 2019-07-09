const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const sourceMaps = new webpack.SourceMapDevToolPlugin({
  include: 'css',
  filename: '[file].map',
  noSources: false,
});

const plugins = [
  ...[sourceMaps],
];

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loaders: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 8081,
    hot: true,
    compress: true,
    open: true,
    contentBase: false,
    publicPath: '/',
    historyApiFallback: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  plugins,
});

module.exports = devWebpackConfig;
