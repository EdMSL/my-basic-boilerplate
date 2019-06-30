const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const sourceMaps = new webpack.SourceMapDevToolPlugin({
  include: 'css',
  filename: '[file].map',
  noSources: false,
});

const plugins = [
  ...[sourceMaps],
];

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // context: 'project',
              publicPath: '../images',
              outputPath: (url, resourcePath, context) => {
                const relativePath = path.relative(context, resourcePath);

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
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 8081,
    hot: true,
    compress: true,
    contentBase: false,
    // contentBase: 'build',
    // contentBase: `${PATHS.dist}`,
    publicPath: '/',
    historyApiFallback: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  plugins,
});

module.exports = devWebpackConfig;
