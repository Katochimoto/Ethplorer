'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin')
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

function page (name) {
  return new HtmlWebpackPlugin({
    filename: name + '.html',
    template: 'pages/' + name + '.twig',
    inject: 'body',
    chunksSortMode: 'dependency',
    alwaysWriteToDisk: true,
    minify: {
      collapseWhitespace: true,
      keepClosingSlash: true,
      removeComments: true,
      removeEmptyAttributes: true
    },
  })
}

function tmpl (name, params) {
  return new HtmlWebpackPlugin(Object.assign({
    filename: name + '.twig',
    template: 'pages/' + name + '.twig',
    inject: 'body',
    chunksSortMode: 'dependency',
    alwaysWriteToDisk: true,
  }, params))
}

const config = {
  context: srcPath,
  entry: {
    app: path.join(srcPath, 'app.js'),
  },
  output: {
    path: distPath,
    publicPath: publicPath,
    filename: 'js/[name]-[contenthash].js',
    chunkFilename: 'js/[name]-[contenthash].js',
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
    'ethplorer-config': 'ethplorerConfig',
    'ethplorer': 'Ethplorer',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.twig$/,
        oneOf: [
          // {
          //   resourceQuery: /component/,
          //   use: [
          //     {
          //       loader: 'twig-loader',
          //       options: {
          //         twigOptions: {
          //           functions: {
          //             asset: function (file) {
          //               return "${require('" + file + "')}"
          //             },
          //           },
          //           namespaces: {
          //             components: path.join(srcPath, 'templates'),
          //           },
          //         },
          //       },
          //     },
          //   ],
          // },

          {
            use: [
              {
                loader: 'html-loader',
                options: { interpolate: true },
              },
              {
                loader: 'twig-html-loader',
                options: {
                  functions: {
                    asset: function (file) {
                      return "${require('" + file + "')}"
                    },
                  },
                  namespaces: {
                    components: path.join(srcPath, 'templates'),
                  },
                },
              },
            ],
          },

        ],
      },
      {
        test: /\.(s?)css$/,
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
                  require('autoprefixer'),
                  require('lost'),
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
        test: /\.(png|jpe?g|gif|svg)$/,
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
        test: /\.(woff2?|eot|ttf|otf)$/,
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

    page('index'),
    page('chart'),
    page('top'),
    page('top-weekly'),
    page('last'),
    page('widgets'),
    page('about'),
    page('privacy'),
    page('address'),

    tmpl('widgets'),
    tmpl('footer', { inject: false }),
    tmpl('navbar', { inject: false }),

    new HtmlBeautifyPlugin({
      config: {
        html: {
          indent_size: 2,
          indent_inner_html: true,
          no_preserve_newlines: true,
          unformatted: ['script'],
          wrap_line_length: 0,
        },
      },
    }),

    new AddAssetHtmlPlugin([
      {
        filepath: path.join(rootPath, 'node_modules/jquery/dist/jquery.min.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
      },
      {
        filepath: path.join(rootPath, 'api/widget.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
      },
      {
        filepath: path.join(srcPath, 'assets/js/ethplorer-search.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
      },
      {
        filepath: path.join(srcPath, 'assets/js/ethplorer-note.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
      },
      {
        filepath: path.join(srcPath, 'assets/js/jquery-ui.min.js'),
        outputPath: 'js',
        publicPath: '/js',
        hash: true,
      },
    ]),

    // new SriPlugin({
    //   hashFuncNames: ['sha256', 'sha384']
    // }),
  ],

  devServer: {
    noInfo: true,
    hot: false,
    compress: false,
    contentBase: distPath,
    host: 'localhost',
    allowedHosts: [
      'ethplorer.test',
    ],
    port: 9001,
    publicPath: publicPath,
    clientLogLevel: 'warning',
    open: false,
    openPage: '',
    writeToDisk: true,
    proxy: {
      '/api': {
          target: 'https://api2.ethplorer.io',
          changeOrigin: true,
          pathRewrite: {'^/api' : ''},
          // secure: false,
      },
    },
  }
}

module.exports = config
