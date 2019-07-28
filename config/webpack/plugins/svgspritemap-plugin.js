const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const baseWebpackConfig = require('../../webpack.base.config');

module.exports = function(mode) {
  if (mode === 'production') {
    return new SVGSpritemapPlugin([
      `${baseWebpackConfig.externals.paths.src}/images/sprite/**/*.svg`,
    ], {
      output: {
        filename: 'images/sprite.svg',
        chunk: {
          keep: true,
        },
        svg4everybody: false,
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
  }

  return new SVGSpritemapPlugin([
    `${baseWebpackConfig.externals.paths.src}/images/sprite/**/*.svg`,
  ], {
    output: {
      filename: 'images/sprite.svg',
    },
    sprite: {
      prefix: false,
    },
  });
}
