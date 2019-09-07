'use strict';

module.exports = {
  extends: [
    './eslint/rules/best-practices.js',
    './eslint/rules/errors.js',
    './eslint/rules/node.js',
    './eslint/rules/strict.js',
    './eslint/rules/style.js',
    './eslint/rules/variables.js',
    'plugin:es5/no-es2015',
  ],
  rules: {},
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  globals: {
    require: false,
    module: false,
    process: false,
  },
};
