const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssExtractPlugin = require('./webpack/plugins/mini-css-extract-plugin');
const SVGSpritePlugin = require('./webpack/plugins/svgspritemap-plugin');
const ImageminWebpPlugin = require('./webpack/plugins/imagemin-webp-webpack-plugin');
const ImageminPluginLossless = require('./webpack/plugins/imagemin-webpack-lossless');
const ImageminPluginLossy = require('./webpack/plugins/imagemin-webpack-lossy');
const baseWebpackConfig = require('./webpack.base.config');

const plugins = [
  new CleanWebpackPlugin(),
  CssExtractPlugin(),
  ImageminWebpPlugin(),
  ImageminPluginLossless(),
  ImageminPluginLossy(),
  SVGSpritePlugin(process.env.NODE_ENV),
];

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          'source-map-loader',
        ],
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              config: {
                path: `${baseWebpackConfig.externals.paths.conf}/postcss.config.js`,
              },
            },
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: false,
              resources: `${baseWebpackConfig.externals.paths.src}/styles/resources/**/*.scss`,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              context: 'images',
              publicPath: (url, resourcePath, context) => {
                if (/content/.test(resourcePath)) {
                  return `${context}/content/${url}`;
                }

                if (/decoration/.test(resourcePath)) {
                  return `../${context}/decoration/${url}`;
                }

                return `${context}/${url}`;
              },
              outputPath: (url, resourcePath, context) => {
                if (/content/.test(resourcePath)) {
                  return `${context}/content/${url}`;
                }

                if (/decoration/.test(resourcePath)) {
                  return `${context}/decoration/${url}`;
                }

                return `${context}/${url}`;
              },
            },
          },
        ],
      },
    ],
  },
  plugins,
});

module.exports = buildWebpackConfig;
