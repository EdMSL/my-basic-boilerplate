const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(templateDir) {
  const templateFiles = fs.readdirSync(templateDir);

  return templateFiles.map((item) => {
    const fileData = item.split('.');
    const name = fileData[0];
    const ext = fileData[1];

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: `${templateDir}/${name}.${ext}`,
      favicon: 'src/images/favicon.ico',
      inject: false,
    });
  });
}
