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
  env: {
    browser: true,
    node: true,
    commonjs: true,
  },
  ecmaFeatures: {},
  rules: {},
  globals: {
    require: false,
    module: false,
    process: false,
  },
};
