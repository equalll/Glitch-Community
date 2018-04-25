const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');



const PUBLIC = path.resolve(__dirname, 'public');
const SRC = path.resolve(__dirname, 'src');
const BASE = path.resolve(__dirname, '.');


module.exports = () => {
  
  let plugins = [];
  let mode = 'development';
  if(process.env.NODE_ENV === 'production') {
    mode = 'production';
    plugins = [
      new UglifyJsPlugin({
        cache: true,
        sourceMap: true,
        uglifyOptions: {
          ecma: 6,
          mangle: true,
          compress: true
        }
      }),
     //https://webpack.js.org/guides/production/#specify-the-environment
     new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
     })
    ];
  }
  
  console.log(`Starting Webpack in ${mode} mode.`);
  
  return {
    mode,
    entry: {
      "client-bundle": `${SRC}/client.js`
    },
    output: {
      filename: '[name].js',
      path: PUBLIC
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.jsx?$/,
          exclude: [/templates/, /cache/],
          include: SRC,
          loader: "eslint-loader",
          options: {
            fix: true,
            //cache: `${SRC}/.eslintcache`, //caching tends to make the config stick, so blank it when reconfiguring
            emitError: true,
            emitWarning: true,
            failOnError: false,
          }
        },
        {
          test: /\.jsx?/,
          include: SRC,
          loader : 'babel-loader'
        }
      ],
    },
    plugins: plugins
  };
}
