module.exports = function(contentBase) {
  return {
    devServer: {
      port: 8081,
      hot: true,
      compress: true,
      open: true,
      contentBase: contentBase,
      watchContentBase: true,
      publicPath: '/',
      historyApiFallback: true,
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  }
}