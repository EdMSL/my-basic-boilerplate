module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    commonjs: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
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
