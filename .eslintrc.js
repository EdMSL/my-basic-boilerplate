module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: false,
    ecmaVersion: 2018,
    ecmaFeatures: {
      globalReturn: false,
    },
  },
  rules: {
    'no-return-assign': 1,
    'import/no-unresolved': 1,
    'import/prefer-default-export': 'off',
    'import/extensions': 1,
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.base.config.js',
      }
    }
  },
}
