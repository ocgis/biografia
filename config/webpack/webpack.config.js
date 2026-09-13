const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    application: './app/javascript/packs/application.js',
    Page: './app/javascript/packs/Page.jsx',
  },
  output: {
    filename: '[name].js',
    // sourceMapFilename: '[file].map',
    // chunkFormat: 'module',
    path: path.resolve(__dirname, '..', '..', 'app/assets/builds'),
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx|)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      src: path.resolve(__dirname, '..', '..', 'app/javascript/src'),
      stylesheets: path.resolve(__dirname, '..', '..', 'app/javascript/stylesheets'),
      components: path.resolve(__dirname, '..', '..', 'app/javascript/components'),
      'jquery-ui': 'jquery-ui-dist/jquery-ui',
    },
  },
};
