'use strict';

module.exports = {
  extends: [
    './eslint/rules/best-practices.js',
    './eslint/rules/errors.js',
    './eslint/rules/node.js',
    './eslint/rules/strict.js',
    './eslint/rules/style.js',
    './eslint/rules/variables.js',
  ],
  rules: {},
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  ecmaFeatures: {},
  globals: {
    require: false,
    module: false,
    process: false,
  },
};
