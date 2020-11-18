const path = require('path')

module.exports = {
  lintOnSave: false,
  devServer: {
    compress: true,
    port: 9000,
    contentBase: path.join(__dirname, 'public')
  }
}
