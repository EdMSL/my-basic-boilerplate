const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const svgo = require('imagemin-svgo');
const baseWebpackConfig = require('./webpack.base.config');

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
    new webpack.SourceMapDevToolPlugin({
      include: 'css',
      filename: '[file].map',
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      optipng: null,
      jpegtran: null,
      svgo: null,
      plugins: [
        imageminMozjpeg({
          quality: 80,
          progressive: true,
          fastCrush: false, /* default false */
          dcScanOpt: 1, /* 1...3 default 1 */
          trellis: true, /* default true */
          tune: 'hvs-psnr', /* Trellis optimization method. Available: psnr, hvs-psnr(default), ssim, ms-ssim */
          trellisDC: true, /* default true */
          overshoot: true, /* default true */
          arithmetic: false, /* default false */
          dct: 'int', /* Available: int(default), fast, float */
        }),
        pngquant({
          quality: [0.3, 0.5],
          speed: 3, /* 1...11 default 3 */
          strip: false, /* default false */
          dithering: 1, /* 0...1 default 1 */
          posterize: 0, /* default 0 */
          verbose: false, /* default false */
        }),
        svgo({
          plugins: [
            { removeComments: true },
            { removeXMLProcInst: true },
          ],
        }),
      ],
    }),
  ],
});

module.exports = buildWebpackConfig;
