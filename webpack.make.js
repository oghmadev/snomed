'use strict'
/* eslint-env node */
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = function makeWebpackConfig (options) {
  const BUILD = !!options.BUILD
  const TEST = !!options.TEST
  const E2E = !!options.E2E
  const DEV = !!options.DEV

  const config = {}

  /**
   * Entry
   * Reference: https://webpack.js.org/concepts/entry-points
   */
  if (TEST) {
    config.entry = {}
  } else {
    config.entry = {
      app: './client/app/app.js',
      polyfills: './client/polyfills.js',
      vendor: ['lodash']
    }
  }

  /**
   * Output
   * Reference: https://webpack.js.org/concepts/output
   */
  if (TEST) {
    // Should be an empty object if it's generating a test build. Karma will set this when it's a test build
    config.output = {}
  } else {
    config.output = {
      path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),
      publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    }
  }

  /**
   * Devtool
   * Reference: https://webpack.js.org/configuration/devtool
   */
  if (TEST) {
    config.devtool = 'inline-source-map'
  } else if (BUILD || DEV) {
    config.devtool = 'source-map'
  } else {
    config.devtool = 'eval'
  }

  /**
   * Loaders
   * Reference: https://webpack.js.org/concepts/loaders
   * List: https://webpack.js.org/loaders
   */
  config.module = {
    rules: [{
      // Reference: https://github.com/babel/babel-loader
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          shouldPrintComment (commentContents) {
            // keep `/*@ngInject*/`
            return /@ngInject/.test(commentContents)
          }
        }
      },
      include: [path.resolve(__dirname, 'client/'), path.resolve(__dirname, 'node_modules/lodash-es/')]
    }, {
      // Reference: https://github.com/s-panferov/awesome-typescript-loader
      test: /\.ts$/,
      use: {
        loader: 'awesome-typescript-loader',
        query: {tsconfig: path.resolve(__dirname, 'tsconfig.client.json')}
      },
      include: [path.resolve(__dirname, 'client/')]
    }, {
      // Reference: https://webpack.js.org/loaders/file-loader
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([?]?.*)$/,
      use: 'file-loader'
    }, {
      // Reference: https://webpack.js.org/loaders/raw-loader
      test: /\.html$/,
      use: 'raw-loader'
    }, {
      test: /\.(scss|sass)$/,
      use: !TEST
        ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          }, {
            // Reference: https://github.com/postcss/postcss-loader
            loader: 'postcss-loader',
            options: {
              config: {ctx: {autoprefixer: {browsers: ['last 2 versions']}}},
              plugins: (loader) => [autoprefixer],
              sourceMap: true
            }
          }, 'sass-loader']
        })
        // Reference: https://webpack.js.org/loaders/style-loader
        // Reference: https://webpack.js.org/loaders/css-loader
        // Reference: https://webpack.js.org/loaders/sass-loader
        : ['style-loader', 'css-loader', 'sass-loader']
    }, {
      // Reference: https://github.com/huston007/ng-annotate-loader
      test: /\.js$/,
      use: 'ng-annotate-loader?single_quotes',
      enforce: 'post'
    }]
  }

  /**
   * Plugins
   * Reference: https://webpack.js.org/concepts/plugins
   * List: https://webpack.js.org/plugins
   */
  config.plugins = [
    // Reference: https://github.com/webpack-contrib/extract-text-webpack-plugin
    new ExtractTextPlugin({
      disable: TEST,
      filename: BUILD ? '[name].[hash].css' : '[name].bundle.css'
    }),

    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: 'client/app.template.html',
      filename: '../client/app.html',
      alwaysWriteToDisk: true
    }),

    // Reference: https://github.com/jantimon/html-webpack-harddisk-plugin
    new HtmlWebpackHarddiskPlugin()
  ]

  config.node = {
    global: true,
    process: true,
    clearImmediate: false,
    setImmediate: false
  }

  // Environment specific configs
  if (BUILD) {
    config.plugins.push(
      // Reference: https://webpack.js.org/plugins/no-emit-on-errors-plugin
      new webpack.NoEmitOnErrorsPlugin(),

      // Reference: https://webpack.js.org/plugins/uglifyjs-webpack-plugin
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        output: {comments: false},
        sourceMap: true
      }),

      // Reference: https://webpack.js.org/plugins/define-plugin
      new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}})
    )
  }

  config.cache = DEV

  if (DEV) {
    config.plugins.push(
      // Reference: https://webpack.js.org/plugins/define-plugin
      new webpack.DefinePlugin({'process.env': {NODE_ENV: '"development"'}})
    )
  }

  if (TEST) {
    config.module.rules.push({
      // Reference: https://github.com/ColCh/isparta-instrumenter-loader
      test: /\.js$/,
      exclude: /(node_modules|spec\.js|mock\.js)/,
      use: 'isparta-instrumenter-loader',
      query: {babel: {/* optional: ['runtime', 'es7.classProperties', 'es7.decorators'] */}},
      enforce: 'pre'
    })

    // Reference: https://webpack.js.org/plugins/loader-options-plugin
    config.plugins.push(new webpack.LoaderOptionsPlugin({debug: true}))

    config.resolve = {
      modules: ['node_modules'],
      extensions: ['.js', '.ts']
    }

    config.stats = {
      colors: true,
      reasons: true
    }
  }

  if (!TEST) {
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }))
  }

  return config
}
