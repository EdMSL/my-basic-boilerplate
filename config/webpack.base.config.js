const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../build'),
  conf: path.join(__dirname, './config'),
};

const htmlPlugin = new HtmlWebpackPlugin({
  title: 'Basic boilerplate',
  template: `${PATHS.src}/index.html`,
  filename: 'index.html',
  favicon: 'src/images/favicon.ico',
  inject: false,
});

// const copyContentImages = new CopyWebpackPlugin([
//   {
//     from: `${PATHS.src}/images/content/*`,
//     to: 'images/content/[name].[ext]',
//     // ignore: ['*.svg'],
//   },
// ]);

const plugins = [
  new webpack.WatchIgnorePlugin(['build']),
  htmlPlugin,
  // copyContentImages,
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
      $components: path.resolve(__dirname, `${PATHS.src}/components/`),
      $styles: path.resolve(__dirname, `${PATHS.src}/styles/`),
      $images: path.resolve(__dirname, `${PATHS.src}/images/`),
    },
    extensions: ['.js'],
    descriptionFiles: ['package.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          'source-map-loader',
          'babel-loader',
        ],
      },
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
  plugins,
};

module.exports = configuration;
