const path = require('path');
const Socket = require('net').Socket;
const CopyPlugin = require("copy-webpack-plugin");
const LwcWebpackPlugin = require('lwc-webpack-plugin');

module.exports = async env => {
  const isServerRunning = (env && env.production) ? false : true;
  const port = await findPort();

  const config = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|svg|webp|gif)$/i,
          use: [{
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'images/',
                  // esModule: false     // To make the require to images to work (used by inlineRequires).
              }
          }]
        }
      ]
    },
    plugins: [
      new LwcWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: 'src/index.html', to: 'index.html' },
          { from: 'src/assets/styles', to: 'styles' },
          { from: 'src/assets/images', to: 'images' },
        ],
      }),
    ]
  }

  if (isServerRunning) {
    config.devServer = {
      compress: false,
      static: './dist',
      hot: true,
      host: '0.0.0.0',
      port: port,
      open: ['/index.html']
    };
  }

  return config;
};

//////////////////////////////////////////////////
// Find Port                                    //
//////////////////////////////////////////////////
async function findPort() {
  for await (var port of asyncIterable) { }

  if (port) {
      return port;
  } else {
      throw Error('No port available!');
  }
}

const asyncIterable = {
  [Symbol.asyncIterator]() {
      return {
          timeout: 400,
          current: 3000,
          endPort: 3099,
          found: false,
          next() {
              if (this.current <= this.endPort && !this.found) {
                  return new Promise((resolve, reject) => {
                      var socket = new Socket();
                      socket.on('connect', () => {
                          socket.destroy();
                          this.current++;
                          resolve({ value: false, done: false });
                      });

                      socket.setTimeout(this.timeout);
                      socket.on('timeout', () => {
                          if (process.platform !== 'win32') {
                              socket.destroy();
                              this.current++;
                              resolve({ value: false, done: false });
                          } else {
                              this.found = true; // will end the loop
                              resolve({ value: this.current, done: false });
                          }
                      });

                      socket.on('error', exception => {
                          this.found = true; // will end the loop
                          resolve({ value: this.current, done: false });
                      });

                      socket.connect(this.current, 'localhost');
                  });
              }

              return Promise.resolve({ done: true });
          }
      };
  }
};