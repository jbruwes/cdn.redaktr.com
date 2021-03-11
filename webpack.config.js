const copyWebpackPlugin = require('copy-webpack-plugin');
const
  path = require('path'),
  webpack = require('webpack'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CssMinimizerPlugin = require('css-minimizer-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './source/redaktr.js',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jsel: 'jsel',
      AOS: 'aos',
      tsParticles: 'tsparticles'
    }),
    new MiniCssExtractPlugin({
      filename: "redaktr.min.css"
    }),
    new copyWebpackPlugin([
      { from: 'resource/robots.txt' },
      { from: 'resource/particles', to: 'resource/particles' }
    ])
  ],
  output: {
    filename: 'redaktr.min.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'resource/[name][ext]'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }, {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ]
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ]
  }
};