const webpack = require('webpack');
const merge = require('webpack-merge');
const css = require('./webpack/rules/css');
const js = require('./webpack/rules/js');
const images = require('./webpack/rules/images');
const SVGSpritePlugin = require('./webpack/plugins/svgspritemap-plugin');
const baseWebpackConfig = require('./webpack.base.config');

const sourceMaps = new webpack.SourceMapDevToolPlugin({
  include: ['css', 'js', 'scss'],
  filename: '[file].map',
  noSources: false,
});

const plugins = [
  // ...[sourceMaps],
  SVGSpritePlugin(process.env.NODE_ENV, `${baseWebpackConfig.externals.paths.src}/images/sprite`),
];

const devWebpackConfig = merge([
  baseWebpackConfig,
  {
    mode: 'development',
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
  },
  css('development'),
  js(),
  images(),
]);
module.exports = devWebpackConfig;

//TODO Во время компиляции игнорируется ошибка в js.
