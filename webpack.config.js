const copyWebpackPlugin = require('copy-webpack-plugin');
const
  path = require('path'),
  webpack = require('webpack'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  MinifyBundledPlugin = require('minify-bundled-webpack-plugin');


module.exports = {
  mode: 'production',
  entry: './source/redaktr.js',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jsel: 'jsel',
      AOS: 'aos',
      tsparticles: 'tsparticles'
    }),
    new copyWebpackPlugin([
      { from: 'resource/robots.txt' },
      { from: 'resource/redaktr.css', to: 'redaktr.min.css' },
      { from: 'resource/redaktr.cdn.css', to: 'redaktr.cdn.min.css' },
      { from: 'resource/particles', to: 'particles' }
    ]),
    new MinifyBundledPlugin({
      patterns: ['*.css','**/particles/*.json'],
    })
  ],
  output: {
    filename: 'redaktr.min.js',
    path: path.resolve(__dirname, 'dist'),
  }
};