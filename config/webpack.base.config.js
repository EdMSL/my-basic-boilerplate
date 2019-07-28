const webpack = require('webpack');
const path = require('path');
const copyContentImages = require('./webpack/plugins/copy-content-images');
const generateHtmlPlugins = require('./webpack/plugins/html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../build'),
  conf: path.join(__dirname, './config'),
};

const plugins = [
  new webpack.WatchIgnorePlugin(['build']),
  ...generateHtmlPlugins(`${PATHS.src}/html`),
  copyContentImages(`${PATHS.src}/images/content`),
];

const configuration = {
  entry: `${PATHS.src}/index.js`,
  output: {
    path: `${PATHS.dist}`,
    filename: 'js/index.js',
    sourceMapFilename: '[name].js.map',
    publicPath: '/',
  },
  externals: {
    paths: PATHS,
  },
  resolve: {
    alias: {
      $root: path.resolve(__dirname, `${PATHS.src}/`),
      $js: path.resolve(__dirname, `${PATHS.src}/js/`),
      $styles: path.resolve(__dirname, `${PATHS.src}/styles/`),
      $images: path.resolve(__dirname, `${PATHS.src}/images/`),
    },
    extensions: ['.js'],
    descriptionFiles: ['package.json'],
  },
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '../fonts',
            outputPath: 'fonts/',
          },
        },
      },
    ],
  },
  stats: {
    all: false,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    moduleTrace: true,
    errorDetails: true,
  },
  plugins,
};

module.exports = configuration;
