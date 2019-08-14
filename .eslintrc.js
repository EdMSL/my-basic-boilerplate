module.exports = {
  root: true,
  extends: [
    './config/eslint.es5.config.js',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.base.config.js',
      }
    }
  },
}
