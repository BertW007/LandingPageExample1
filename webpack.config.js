const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractPlugin = new ExtractTextPlugin({
    filename: 'css/style.css'
});

module.exports = {
  entry: ['./src/js/index.js'],
  output: {
    path: path.resolve(__dirname,'dist/'),
    filename: 'js/bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test : /\.js$/,
        exclude : /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: 'env',
          },
        },
      },
      {
        test: /\.scss$/,
        use: ExtractPlugin.extract({
          use: [
          {loader: 'css-loader',options:{importLoaders: 1}},
          'postcss-loader',
          {loader: 'sass-loader',options: { precision: 8 }}
        ]
        })
      },
      {
        test: /\.css$/,
        use: [
        {loader: 'style-loader'},
        {loader: 'css-loader',options:{importLoaders: 1}},
        'postcss-loader',
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {limit: 10000, outputPath: 'img/',publicPath:'../img'},
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {limit: 10000, outputPath: 'fonts/',publicPath:'../fonts'},
        }
      },
    ]
  },
  plugins: [ExtractPlugin, new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery", "window.jQuery": "jquery"})]
};
