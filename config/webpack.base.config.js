const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../build'),
  conf: path.join(__dirname, './config'),
};

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(templateDir);

  return templateFiles.map((item) => {
    const fileData = item.split('.');
    const name = fileData[0];
    const ext = fileData[1];

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: `${PATHS.src}/html/${name}.${ext}`,
      favicon: 'src/images/favicon.ico',
      inject: false,
    });
  });
}

// const htmlPlugin = new HtmlWebpackPlugin({
//   title: 'Basic boilerplate',
//   template: `${PATHS.src}/index.html`,
//   filename: 'index.html',
//   favicon: 'src/images/favicon.ico',
//   inject: false,
// });

const copyContentImages = new CopyWebpackPlugin([
  {
    from: `${PATHS.src}/images/content/*`,
    to: 'images/content/[name].[ext]',
    // ignore: ['*.svg'],
  },
]);

const htmlPlugin = generateHtmlPlugins(`${PATHS.src}/html`);

const plugins = [
  new webpack.WatchIgnorePlugin(['build']),
  ...htmlPlugin,
  copyContentImages,
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
