const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminWebpack = require('imagemin-webpack');
const imageminMozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const svgo = require('imagemin-svgo');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');

const CssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'css/styles.css',
  chunkFilename: 'css/[id].css',
});

const ImageminPlugin1 = new ImageminPlugin({
  test: /\.(jpe?g|png|gif|svg)$/i,
  optipng: null,
  jpegtran: null,
  svgo: null,
  plugins: [
    imageminMozjpeg({
      quality: 90,
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
});

// const ImageminPlugin = new ImageminWebpack({
//   // When cache = true, use "rm -rf ./node_modules/.cache/imagemin-webpack" if change options for imagemin plugin!
//   test: /.(jpe?g|png|gif|svg|webp)$/i,
//   cache: false,
//   bail: false,
//   loader: false,
//   name: 'images/[name].[ext]',
//   imageminOptions: {
//     plugins: [
//       imageminMozjpeg({
//         quality: 90,
//         progressive: true,
//         fastCrush: false, /* default false */
//         dcScanOpt: 1, /* 1...3 default 1 */
//         trellis: true, /* default true */
//         tune: 'hvs-psnr', /* Trellis optimization method. Available: psnr, hvs-psnr(default), ssim, ms-ssim */
//         trellisDC: true, /* default true */
//         overshoot: true, /* default true */
//         arithmetic: false, /* default false */
//         dct: 'int', /* Available: int(default), fast, float */
//       }),
//       pngquant({
//         quality: [0.3, 0.5],
//         speed: 3, /* 1...11 default 3 */
//         strip: false, /* default false */
//         dithering: 1, /* 0...1 default 1 */
//         posterize: 0, /* default 0 */
//         verbose: false, /* default false */
//       }),
//       svgo({
//         plugins: [
//           { removeComments: true },
//           { removeXMLProcInst: true },
//         ],
//       }),
//     ],
//   },
//   filter: (source, sourcePath) => {
//     if (/png\.webp/.test(sourcePath)) {
//       return false;
//     }

//     return true;
//   },
// });

const ImageminWebpPlugin = new ImageminWebpWebpackPlugin({
  config: [{
    test: /\.(jpeg|jpg|png)/,
    options: {
      preset: 'default', /* default, photo, picture, drawing, icon, text */
      quality: 90,
      alphaQuality: 90,
      method: 4, /* 0...6 default 4 */
      sns: 80, /* 0...100 default 80 */
      filter: 80, /* 0...100 */
      autoFilter: true, /* default true */
      sharpness: 1, /* 0...7 default 0 */
      verbose: false, /* default false */
    },
  }],
  overrideExtension: false,
  detailedLogs: true,
  silent: false,
  strict: true,
});

const plugins = [
  new CleanWebpackPlugin(),
  CssExtractPlugin,
  ImageminWebpPlugin,
  ImageminPlugin1,
];

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 1,
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
        ],
      },
      {
        test: /\.(png|jpe?g)$/,
        // exclude: `${baseWebpackConfig.externals.paths.src}/images/content`,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              context: 'images',
              publicPath: (url, resourcePath, context) => {
                if (/content/.test(resourcePath)) {
                  return `${context}/${url}`;
                }

                if (/decoration/.test(resourcePath)) {
                  return `../${context}/${url}`;
                }

                return `output_path/${url}`;
              },
              outputPath: (url, resourcePath) => {
                // const relativePath = path.relative(context, resourcePath);
                if (/my-custom-image\.png/.test(resourcePath)) {
                  return `other_output_path/${url}`;
                }

                if (/images/.test(resourcePath)) {
                  return `images/${url}`;
                }

                return `output_path/${url}`;
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
