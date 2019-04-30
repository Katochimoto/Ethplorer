'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const SriPlugin = require('webpack-subresource-integrity')
//const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
//const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
//const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const publicPath = '/'
const rootPath = process.cwd()
const srcPath = path.join(rootPath, 'src/client')
const distPath = path.join(rootPath, 'dist')

const config = {
  context: srcPath,
  entry: {
    main: path.join(srcPath, 'app.js'),
  },
  output: {
    path: distPath,
    publicPath: publicPath,
    filename: '[contenthash].js',
    chunkFilename: '[contenthash].js',
    crossOriginLoading: 'anonymous'
  },
  resolve: {
    alias: {
      '@': srcPath
    },
  },
  externals: {
    'jquery': 'jQuery',
    'ethplorer-widget': 'ethplorerWidget',
    'ethplorer-search': 'EthplorerSearch',
    'ethplorer-note': 'EthplorerNote',
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              partialDirs: [
                path.join(srcPath, 'templates', 'components')
              ],
              inlineRequires: '\/assets\/images\/'
            }
          },
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : ExtractCssChunks.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              outputPath: 'images'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          outputPath: 'fonts'
        }
      },
    ]
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false
          }
        }
      })
    ],
    splitChunks: {
      minSize: 100000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      cacheGroups: {
        'v-style': {
          name: 'v-style',
          test (module) {
            return module.type === 'css/extract-css-chunks' && /[\\/]node_modules[\\/]/.test(module.context);
          },
          enforce: true,
          chunks: 'all',
          priority: 200
        },
        'style': {
          name: 'style',
          test (module) {
            return module.type === 'css/extract-css-chunks' && !/[\\/]node_modules[\\/]/.test(module.context);
          },
          enforce: true,
          chunks: 'all',
          priority: 100
        },
        'vendors': {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          enforce: true,
          chunks: 'all',
          reuseExistingChunk: true,
        },
        'default': {
          priority: -20,
          reuseExistingChunk: true,
          chunks: 'async',
        },
      },
    },
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: [ 'dist/**/*' ],
    }),
    //new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    //require('./plugins/HashedModuleIdsPlugin')(),
    //require('./plugins/CopyWebpackPlugin')(),
    //require('./plugins/DefinePlugin')(),
    //require('./plugins/WebpackPwaManifest')(),
    new ExtractCssChunks({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[name]-[contenthash].css',
      orderWarning: true,
    }),
    // new FaviconsWebpackPlugin({
    //   logo: path.join(srcPath, 'assets', 'img', 'ico.png'),
    //   prefix: 'icons-[hash:8]/',
    //   persistentCache: true,
    //   inject: true,
    //   icons: {
    //     android: true,
    //     appleIcon: true,
    //     appleStartup: false,
    //     coast: false,
    //     favicons: true,
    //     firefox: true,
    //     opengraph: false,
    //     twitter: false,
    //     windows: false,
    //     yandex: false
    //   }
    // }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'templates/pages/index.hbs',
      inject: false,
      cache: false,
      hash: false,
      chunksSortMode: 'dependency',
      alwaysWriteToDisk: true,
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
    }),

    new AddAssetHtmlPlugin([
      {
        filepath: path.join(rootPath, 'node_modules/jquery/dist/jquery.min.js'),
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(rootPath, 'api/widget.js'),
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(rootPath, 'js/ethplorer-search.js'),
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(rootPath, 'js/ethplorer-note.js'),
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(srcPath, 'assets/js/jquery-ui.min.js'),
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
    ]),

    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384']
    }),
  ],

  devServer: {
    noInfo: true,
    hot: false,
    compress: false,
    contentBase: distPath,
    host: 'localhost',
    port: 9001,
    publicPath: publicPath,
    proxy: {},
    clientLogLevel: 'warning',
    open: true,
    openPage: '',
    // writeToDisk: true,
  }
}

module.exports = config
