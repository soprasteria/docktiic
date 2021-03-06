const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const env = process.env.NODE_ENV || 'development';
const production = env === 'production';
console.info(`Webpack config loaded in ${env} environment`);

const projectRoot = __dirname;
const developmentPort = 8081;

module.exports = {
  devtool: 'source-map',
  devServer: {
    open: true,
    port: developmentPort
  },
  entry: [
    path.join(projectRoot, 'client/src/main.js')
  ],
  output: {
    path: path.join(projectRoot, 'dist/client'),
    publicPath: production ? '/' : `http://localhost:${developmentPort}/`,
    filename: 'js/bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /.ttf$|.eot$|.woff2?$|\.svg$/,
        loader: 'file-loader',
        query: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /.png$|.jpe?g$|.ico?$/,
        loader: 'file-loader',
        query: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new ExtractTextPlugin({
      filename: 'css/bundle.css',
      allChunks: true,
      disable: !production
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      template: 'client/src/index.ejs',
      title: 'D.A.D',
      favicon: 'client/static/favicon.ico',
      hash: true
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // https://stackoverflow.com/a/25426019
  ].concat(
    production
    ? [
      // Production Only Plugins
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        sourceMap: true,
        compress: {
          screw_ie8: true,
          warnings: false,
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
        },
        output: {
          comments: false,
        }
      })
    ]
    : [
      // Development Only Plugins
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  )
};
