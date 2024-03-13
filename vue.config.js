module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        `
      }
    }
  },
  configureWebpack: {
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
    },
  },
};