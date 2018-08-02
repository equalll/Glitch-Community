const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoprefixerStylus = require("autoprefixer-stylus");

class OutputOnBuildStart {
  apply(compiler) {
    compiler.hooks.watchRun.tap("OutputWatchStart", () => console.log('Files changed, rebuilding...'));
  }
}


const PUBLIC = path.resolve(__dirname, 'public');
const SRC = path.resolve(__dirname, 'src');
const STYLES = path.resolve(__dirname, 'styles');
const BASE = path.resolve(__dirname, '.');
const STYLE_BUNDLE_NAME = 'styles';


module.exports = () => {
  
  let mode = 'development';
  if(process.env.NODE_ENV === 'production') {
    mode = 'production';
  }

  console.log(`Starting Webpack in ${mode} mode.`);
  
  return {
    mode,
    entry: {
      "client-bundle": `${SRC}/client.jsx`,
      [STYLE_BUNDLE_NAME]: `${STYLES}/styles.styl`,
    },
    output: {
      filename: '[name].js?[chunkhash]',
      path: PUBLIC,
      publicPath: '/',
    },
    optimization: {
      splitChunks: {
        chunks: 'initial',
        maxInitialRequests: 5,
        cacheGroups: {
          cache: {
            name: 'cache',
            test: /[\\/]src[\\/]cache[\\/]/,
            minSize: 0,
          },
          react: {
            name: 'react-bundle',
            test: /[\\/]node_modules[\\/]react[-\\/]/,
          },
          modules: {
            name: 'dependencies',
            test: /[\\/]node_modules[\\/]/,
            priority: -1,
          },
        },
      },
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
            fix: false,
            cache: false, // Keep this off, it can use a lot of space.  Let Webpack --watch does the heavy lifting for us.
            emitError: false,
            emitWarning: true,
            failOnError: false,
          }
        },
        {
          test: /\.jsx?/,
          include: SRC,
          exclude: /node_modules/,
          loader : 'babel-loader'
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'stylus-loader',
              options: {
                compress: true, // Compress CSS as part of the stylus build
                use: [AutoprefixerStylus()],
              },
            },
          ] 
        },
      ],
    },
    plugins: [
      new OutputOnBuildStart,
      new LodashModuleReplacementPlugin,
      new webpack.NoEmitOnErrorsPlugin(),
      new ManifestPlugin({
        fileName: "scripts.json",
        filter: ({isInitial, name}) => (
          isInitial && name.endsWith('.js') &&
            name !== `${STYLE_BUNDLE_NAME}.js` // omit the no-op CSS bundle .js file 
          ),
      }),
      new ManifestPlugin({
        fileName: "styles.json",
        filter: ({isInitial, name}) => isInitial && name.endsWith('.css'),
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css?[contenthash]"
      }),
    ],
  };
}