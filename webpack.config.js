'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const SriPlugin = require('webpack-subresource-integrity')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

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
    filename: 'js/[contenthash].js',
    chunkFilename: 'js/[contenthash].js',
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
              helperDirs: [
                path.join(srcPath, 'helpers')
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
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractCssChunks({
      filename: 'css/[name]-[contenthash].css',
      chunkFilename: 'css/[name]-[contenthash].css',
      orderWarning: true,
    }),

    new FaviconsWebpackPlugin({
      logo: path.join(srcPath, 'assets', 'images', 'ico.png'),
      prefix: 'icons-[hash:8]/',
      persistentCache: true,
      inject: true,
      title: 'Ethplorer',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        windows: false,
        yandex: false
      }
    }),

    new HtmlWebpackPlugin({
      title: 'Ethplorer — Ethereum tokens explorer and data viewer. Top tokens, Charts, Pulse, Analytics',
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
      meta: [
        { 'http-equiv': 'X-XSS-Protection', content: '1;mode=block' },
        { 'http-equiv': 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains; preload' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
        { name: 'description', content: '' },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: 'https://ethplorer.io' },
        { name: 'og:title', content: 'Ethplorer — Ethereum tokens explorer and data viewer. Top tokens, Charts, Pulse, Analytics' },
        { name: 'og:description', content: '' },
        { name: 'og:image', content: '' },
        { name: 'fb:app_id', content: '257953674358265' },
        { name: 'theme-color', content: '#000000' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    }),

    new AddAssetHtmlPlugin([
      {
        filepath: path.join(rootPath, 'node_modules/jquery/dist/jquery.min.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(rootPath, 'api/widget.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(rootPath, 'js/ethplorer-search.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(rootPath, 'js/ethplorer-note.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
        attributes: {
          nomodule: true,
        },
      },
      {
        filepath: path.join(srcPath, 'assets/js/jquery-ui.min.js'),
        outputPath: 'js',
        publicPath: '/js',
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
