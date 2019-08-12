const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const fonts = require('./webpack/rules/fonts');
const copyImages = require('./webpack/plugins/copy-images');
const generateHtmlPlugins = require('./webpack/plugins/html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../build'),
  conf: path.join(__dirname, './config'),
};

const plugins = [
  new webpack.WatchIgnorePlugin(['build']),
  ...generateHtmlPlugins(`${PATHS.src}/html`),
  copyImages(`${PATHS.src}/images/content`),
];

const configuration = merge([
  {
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
  },
  fonts(),
]);

module.exports = configuration;
