const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const fs = require('fs');
const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',

  devServer: {
    client: {
      overlay: false
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: ``
      }
    }
  },

  filenameHashing: true,

  pluginOptions: {
    cordovaPath: 'src-cordova'
  },

  configureWebpack: (config) => {

    const plugins = [
      new FaviconsWebpackPlugin({
        logo: './src/assets/images/malawi-logo.jpg',
        mode: 'webapp',
        devMode: 'webapp',
        favicons: {
          appName: 'DODMA CTS',
          appDescription: 'DODMA CTS APP',
          developerName: 'John Chalera <chalera4@gmail.com>',
          developerURL: null,
          background: '#ddd',
          theme_color: '#333',
          icons: {
            coast: false,
            yandex: false
          }
        }
      })
    ];


    // ONLY run version plugin in production
    if (process.env.NODE_ENV === 'production') {
      plugins.push({
        apply: (compiler) => {
          compiler.hooks.beforeRun.tap('VersionPlugin', () => {

            const versionFile = path.resolve(__dirname, 'public/version.json');

            let version = "1.0.0";

            // read existing version
            if (fs.existsSync(versionFile)) {
              try {
                const current = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
                version = current.version || "1.0.0";
              } catch (err) {
                console.warn("Could not read version.json, resetting version");
              }
            }

            // increment patch version
            const parts = version.split('.');
            parts[2] = parseInt(parts[2] || 0) + 1;

            const newVersion = parts.join('.');

            fs.writeFileSync(
              versionFile,
              JSON.stringify({ version: newVersion }, null, 2),
              'utf8'
            );

            console.log(`System version updated: ${version} → ${newVersion}`);

          });
        }
      });
    }

    config.plugins = [...(config.plugins || []), ...plugins];
  }
};