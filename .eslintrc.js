module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    commonjs: true,
    node: true,
  },
  extends: [
    './config/eslint/best-practices',
    './config/eslint/error',
    './config/eslint/es6',
    './config/eslint/node',
    './config/eslint/strict',
    './config/eslint/style',
    './config/eslint/variables',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.base.config.js',
      }
    }
  },
}
