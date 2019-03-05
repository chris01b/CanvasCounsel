const path = require('path')
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {

  mode: 'development',

  entry: {
    background: path.join(__dirname, '../background/background.js'),
    popup: path.join(__dirname, '../popup/popup.js'),
    payment: path.join(__dirname, '../payment/payment.js'),
  },

  output: {
    path: path.join(__dirname, '../../ChromeExtension'),
    filename: '[name].js'
  },

  plugins: [
    new CopyPlugin([
      { from: path.join(__dirname, '../static') }
    ]),
  ],

};
