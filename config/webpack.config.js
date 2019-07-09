const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const svgo = require('imagemin-svgo');
const webp = require('imagemin-webp');
const glob = require('glob');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../build'),
  conf: path.join(__dirname, './config'),
};

const isDevelopment = process.env.NODE_ENV !== 'production';
const devtool = isDevelopment ? 'cheap-module-eval-source-map' : '';

const sourceMaps = new webpack.SourceMapDevToolPlugin({
  include: 'css',
  filename: '[file].map',
  noSources: false,
});

const htmlPlugin = new HtmlWebpackPlugin({
  title: 'Basic boilerplate',
  template: `${PATHS.src}/index.html`,
  filename: 'index.html',
  favicon: 'src/images/favicon.ico',
  inject: false,
});

const html = glob.sync(`${PATHS.src}/html/*.html`)
  .map((htmlFile) => {
    return new HtmlWebpackPlugin({
      filename: path.basename(htmlFile),
      template: htmlFile,
      favicon: 'src/images/favicon.ico',
      inject: false,
    });
  });

const cssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'css/styles.css',
  chunkFilename: 'css/[id].css',
});

const imagemin = new ImageminPlugin({
  test: /\.(jpe?g|png|gif|svg)$/i,
  optipng: null,
  jpegtran: null,
  svgo: null,
  plugins: [
    webp({
      preset: 'default',
      quality: 70,
      alphaQuality: 90,
      method: 3, /* 0...6 default 4 */
      sns: 80, /* 0...100 default 80 */
      filter: 80, /* 0...100 */
      autoFilter: true, /* default true */
      sharpness: 1, /* 0...7 default 0 */
      lossless: false, /* default false */
      nearLossless: 100, /* 0...100 default 100 */
      verbose: false, /* default false */
    }),
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
});

const plugins = [
  new webpack.WatchIgnorePlugin([`${PATHS.dist}`]),
  ...(isDevelopment ? [] : [new CleanWebpackPlugin()]),
  htmlPlugin,
  ...(isDevelopment ? [] : [cssExtractPlugin]),
  ...(isDevelopment ? [sourceMaps] : []),
  // new CopyWebpackPlugin([{
  //   from: `${PATHS.src}/images/**/*.{jpg,jpeg,png}`,
  //   to: 'images/[name].webp',
  // }]),
  ...(isDevelopment ? [] : [imagemin]),
  // new ImageminPlugin({
  //   plugins: [
  //     webp({
  //       // preset: 'default',
  //       quality: 70,
  //       alphaQuality: 90,
  //       method: 3, /* 0...6 default 4 */
  //       sns: 80, /* 0...100 default 80 */
  //       filter: 80, /* 0...100 */
  //       autoFilter: true, /* default true */
  //       sharpness: 1, /* 0...7 default 0 */
  //       lossless: false, /* default false */
  //       nearLossless: 100, /* 0...100 default 100 */
  //       verbose: false, /* default false */
  //     }),
  //   ],
  // }),
];

const configuration = {
  entry: `${PATHS.src}/index.js`,
  output: {
    path: `${PATHS.dist}`,
    filename: 'js/index.js',
    sourceMapFilename: '[name].js.map',
    publicPath: '/',
  },
  resolve: {
    alias: {
      $root: path.resolve(__dirname, `${PATHS.src}/`),
      $styles: path.resolve(__dirname, `${PATHS.src}/styles/`),
      $images: path.resolve(__dirname, `${PATHS.src}/images/`),
    },
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          (isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader),
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: true,
              importLoaders: 1,
            },
          },
          ...(isDevelopment
            ? []
            : [{
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: `${PATHS.conf}/postcss.config.js`,
                },
              },
            }]
          ),
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         modules: true,
      //         sourceMap: true,
      //         importLoaders: 2,
      //         localIdentName: '[local]'
      //       }
      //     },
      //     {
      //       loader: 'sass-loader',
      //     },
      //     {
      //       loader: 'sass-resources-loader',
      //       options: {
      //         sourceMap: true,
      //         resources: ['src/styles/resources.scss'],
      //       },
      //     },
      //   ]
      // },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(js)$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.(png|jpe?g)$/,
        // include: `${PATHS.src}/images/`,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // context: 'project',
              publicPath: '../images',
              outputPath: (url, resourcePath, context) => {
                const relativePath = path.relative(context, resourcePath);
                console.log('-------------------------------------------------------');
                console.log(context);
                console.log(resourcePath);
                console.log(relativePath);
                console.log(url);
                // `resourcePath` is original absolute path to asset
                // `context` is directory where stored asset (`rootContext`) or `context` option

                // To get relative path you can use
                // const relativePath = path.relative(context, resourcePath);

                if (/my-custom-image\.png/.test(resourcePath)) {
                  return `other_output_path/${url}`;
                }
                console.log(/images/.test(resourcePath));
                if (/images/.test(resourcePath)) {
                  return `images/${url}`;
                }

                return `output_path/${url}`;
              },
            },
          },
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     // disable: false,
          //     mozjpeg: {
          //       progressive: true,
          //       quality: 65,
          //     },
          //     // optipng.enabled: false will disable optipng
          //     optipng: {
          //       enabled: false,
          //     },
          //     pngquant: {
          //       quality: '65-90',
          //       speed: 4,
          //     },
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     // the webp option will enable WEBP
          //     webp: {
          //       quality: 75,
          //     },
          //   },
          // },
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
  devServer: {
    port: 8081,
    hot: true,
    compress: true,
    contentBase: false,
    // contentBase: 'images',
    // contentBase: `${PATHS.dist}`,
    // contentBase: `${baseWebpackConfig.externals.paths.dist}`,
    publicPath: '/',
    historyApiFallback: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  devtool,
  plugins,
};

console.log(configuration.plugins);

module.exports = configuration;
