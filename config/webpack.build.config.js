const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageminWebpack = require('imagemin-webpack');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');

const CssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'css/styles.css',
  chunkFilename: 'css/[id].css',
});

const ImageminPluginLossless = new ImageminWebpack({
  // When cache = true, use "rm -rf ./node_modules/.cache/imagemin-webpack" if change options for imagemin plugin!
  test: /.(jpe?g|png|gif|svg)$/i,
  cache: false,
  bail: false,
  loader: false,
  name: 'images/content/[name].[ext]',
  imageminOptions: {
    plugins: [
      imageminJpegtran({
        progressive: true, /* default false */
        arithmetic: false, /* default false */
      }),
      imageminOptipng({
        optimizationLevel: 3, /* 0...7 default 3 */
        bitDepthReduction: true, /* default true */
        colorTypeReduction: true, /* default true */
        paletteReduction: true, /* default true */
      }),
      imageminSvgo({
        plugins: [
          { removeComments: true },
          { removeXMLProcInst: true },
        ],
      }),
      imageminGifsicle({
        interlaced: true, /* default false */
        optimizationLevel: 1, /* 1...3 default 1 */
        colors: 256, /* 2...256, max colors in img */
      }),
    ],
  },
  filter: (source, sourcePath) => {
    if (/png\.webp/.test(sourcePath)) {
      return false;
    }

    if (/decoration/.test(sourcePath)) {
      return false;
    }

    if (/icons/.test(sourcePath)) {
      return false;
    }

    if (/sprite/.test(sourcePath)) {
      return false;
    }

    return true;
  },
});

const ImageminPluginLossy = new ImageminWebpack({
  // When cache = true, use "rm -rf ./node_modules/.cache/imagemin-webpack" if change options for imagemin plugin!
  test: /.(jpe?g|png|gif|svg)$/i,
  cache: false,
  bail: false,
  loader: false,
  name: 'images/decoration/[name].[ext]',
  imageminOptions: {
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
      imageminPngquant({
        quality: [0.3, 0.5],
        speed: 3, /* 1...11 default 3 */
        strip: false, /* default false */
        dithering: 1, /* 0...1 default 1 */
        posterize: 0, /* default 0 */
        verbose: false, /* default false */
      }),
      imageminSvgo({
        plugins: [
          { removeComments: true },
          { removeXMLProcInst: true },
        ],
      }),
      imageminGifsicle({
        interlaced: true, /* default false */
        optimizationLevel: 1, /* 1...3 default 1 */
        colors: 256, /* 2...256, max colors in img */
      }),
    ],
  },
  filter: (source, sourcePath) => {
    if (/png\.webp/.test(sourcePath)) {
      return false;
    }

    if (/content/.test(sourcePath)) {
      return false;
    }

    if (/icons/.test(sourcePath)) {
      return false;
    }

    if (/sprite/.test(sourcePath)) {
      return false;
    }

    return true;
  },
});

const ImageminWebpPlugin = new ImageminWebpWebpackPlugin({
  config: [{
    test: /\.(jpe?g|png)/,
    options: {
      preset: 'default', /* default, photo, picture, drawing, icon, text */
      quality: 85,
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

const SVGSpritePlugin = new SVGSpritemapPlugin([
  `${baseWebpackConfig.externals.paths.src}/images/icons/**/*.svg`,
], {
  output: {
    filename: 'images/sprite.svg',
    chunk: {
      keep: true,
    },
    svg4everybody: false,
    // svgo: false,
    svgo: {
      removeComments: true,
      removeXMLProcInst: true,
    },
  },
  sprite: {
    prefix: false,
    generate: {
      title: false,
    },
  },
});

const plugins = [
  new CleanWebpackPlugin(),
  CssExtractPlugin,
  SVGSpritePlugin,
  ImageminWebpPlugin,
  ImageminPluginLossless,
  ImageminPluginLossy,
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
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
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
        test: /\.(png|jpe?g|gif)$/,
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

                if (/icons/.test(resourcePath)) {
                  return `../${context}/icons/${url}`;
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

                if (/icons/.test(resourcePath)) {
                  return `${context}/icons/${url}`;
                }

                return `${context}/${url}`;
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
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

                if (/icons/.test(resourcePath)) {
                  return `../${context}/icons/${url}`;
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

                if (/icons/.test(resourcePath)) {
                  return `${context}/icons/${url}`;
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
