module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.base.config.js',
      }
    }
  },
}
