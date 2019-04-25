'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
//const SriPlugin = require('webpack-subresource-integrity')
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
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          'pug-loader'
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
    //new webpack.optimize.OccurrenceOrderPlugin(),
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
    // new SWPrecacheWebpackPlugin({
    //   verbose: true,
    //   cacheId: 'wizata',
    //   filename: 'sw.js',
    //   dontCacheBustUrlsMatching: /\.\w{8}\./,
    //   minify: false,
    //   // navigateFallback: homepage + 'index.html',
    //   staticFileGlobsIgnorePatterns: [
    //     /\.map$/,
    //     /\.cache$/,
    //     /\.webapp$/,
    //     /\.xml$/,
    //     /\.txt$/,
    //     /manifest.*\.json$/
    //   ]
    // }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'templates/index.pug',
      inject: false,
      cache: false,
      hash: false,
      chunksSortMode: 'dependency',
      alwaysWriteToDisk: true,
    }),

    // new SriPlugin({
    //   hashFuncNames: ['sha256', 'sha384']
    // }),
  ]
}

module.exports = config
