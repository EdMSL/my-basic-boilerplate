const path = require('path');

const resources = [
  'functions.scss',
  'colors.scss',
  'variables.scss',
  'fonts.scss',
  'mixins.scss',
];

export const sassResources = resources.map(file => path.resolve(__dirname, file));

console.log(sassResources);
