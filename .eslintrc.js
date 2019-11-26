module.exports = {
  root: true,
  extends: [
    // all rules from airbnb config
    './config/eslint.es6.config.js',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.base.config.js',
      }
    }
  },
}
