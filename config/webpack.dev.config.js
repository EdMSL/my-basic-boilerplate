const webpack = require('webpack');
const merge = require('webpack-merge');
const SVGSpritePlugin = require('./webpack/plugins/svgspritemap-plugin');
const baseWebpackConfig = require('./webpack.base.config');

const sourceMaps = new webpack.SourceMapDevToolPlugin({
  include: ['css', 'js', 'scss'],
  filename: '[file].map',
  noSources: false,
});

const plugins = [
  // ...[sourceMaps],
  SVGSpritePlugin(process.env.NODE_ENV),
];

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          // 'source-map-loader',
        ],
      },
      {
        test: /\.(scss|sass|css)$/,
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
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  plugins,
});
module.exports = devWebpackConfig;

//TODO Во время компиляции игнорируется ошибка в js.
