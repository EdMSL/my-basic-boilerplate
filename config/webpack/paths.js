const path = require('path');

const paths = [
  'functions.scss',
  'colors.scss',
  'variables.scss',
  'fonts.scss',
  'mixins.scss',
];

const sassResources = paths.map(file => path.resolve(__dirname, file));
