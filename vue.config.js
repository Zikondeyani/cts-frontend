const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        `
      }
    }
  },

  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  },

  configureWebpack: {
    plugins: [
      new FaviconsWebpackPlugin({
        logo: './src/assets/images/malawi-logo.jpg', // Path to your logo file
        mode: 'webapp', // 'webapp' or 'light' or 'auto' - automatically chooses the best mode
        devMode: 'webapp', // 'webapp' or 'light' or 'auto' - same as above but for development mode
        favicons: {
          appName: 'DODMA CTS',
          appDescription: 'DODMA CTS APP',
          developerName: 'John Chalera <chalera4@gmail.com>',
          developerURL: null, // prevent retrieving from the nearest package.json
          background: '#ddd',
          theme_color: '#333',
          icons: {
            coast: false,
            yandex: false
          }
        }
      })
    ]
  }
};
