const webpack = require('webpack');
const merge = require('webpack-merge');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');


const sourceMaps = new webpack.SourceMapDevToolPlugin({
  include: ['css', 'js', 'scss'],
  filename: '[file].map',
  noSources: false,
});

const SVGSpritePlugin = new SVGSpritemapPlugin([
  `${baseWebpackConfig.externals.paths.src}/images/sprite/**/*.svg`,
], {
  output: {
    filename: 'images/sprite.svg',
  },
  sprite: {
    prefix: false,
  },
});

const plugins = [
  ...[sourceMaps],
  SVGSpritePlugin,
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
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: true,
              resources: `${baseWebpackConfig.externals.paths.src}/styles/resources/**/*.scss`,
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
  // devtool: false,
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 8081,
    hot: true,
    compress: true,
    open: true,
    contentBase: `${baseWebpackConfig.externals.paths.src}/html`, // need for reload browser after compilation HTML changes.
    watchContentBase: true,
    publicPath: '/',
    historyApiFallback: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  plugins,
});

module.exports = devWebpackConfig;
