'use strict'

import _ from 'lodash'
import del from 'del'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import http from 'http'
import open from 'open'
import lazypipe from 'lazypipe'
import nodemon from 'nodemon'
import { Server as KarmaServer } from 'karma'
import runSequence from 'run-sequence'
import { protractor, webdriver_update } from 'gulp-protractor'
import { Instrumenter } from 'isparta'
import webpack from 'webpack-stream'
import makeWebpackConfig from './webpack.make'

let config
const plugins = gulpLoadPlugins()
const clientPath = 'client'
const serverPath = 'server'
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    styles: `${clientPath}/assets/styles/**/*`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [`${clientPath}/**/!(*.spec|*.mock).js`],
    test: [`${clientPath}/{app,resources}/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js']
  },
  server: {
    scripts: [`${serverPath}/**/!(*.spec|*.integration).js`, `!${serverPath}/config/local.env.sample.js`],
    json: [`${serverPath}/**/*.json`],
    template: `${serverPath}/components/pdf/templates/**/*`,
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
    }
  },
  karma: 'karma.conf.js',
  dist: 'dist'
}

/********************
 * Helper functions
 ********************/

function checkAppReady (cb) {
  const options = {
    host: 'localhost',
    port: config.port
  }

  http.get(options, () => cb(true))
    .on('error', () => cb(false))
}

// Call page until first success
function whenServerReady (cb) {
  let serverReady = false
  const appReadyInterval = setInterval(() =>
    checkAppReady((ready) => {
      if (!ready || serverReady) return

      clearInterval(appReadyInterval)
      serverReady = true
      cb()
    }), 100)
}

/********************
 * Reusable pipelines
 ********************/

const mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: ['./mocha.conf']
  })

const istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: './coverage',
    rootDirectory: ''
  })

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig

  try {
    localConfig = require(`./${serverPath}/config/local.env`)
  } catch (e) {
    localConfig = {}
  }

  plugins.env({vars: localConfig})
})

gulp.task('env:test', () => {
  plugins.env({vars: {NODE_ENV: 'test'}})
})

gulp.task('env:prod', () => {
  plugins.env({vars: {NODE_ENV: 'production'}})
})

/********************
 * Tasks
 ********************/

gulp.task('webpack:dev', () => {
  const webpackDevConfig = makeWebpackConfig({DEV: true})

  return gulp.src(webpackDevConfig.entry.app)
    .pipe(plugins.plumber())
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest('.tmp'))
})

gulp.task('webpack:dist', () => {
  const webpackDistConfig = makeWebpackConfig({BUILD: true})

  return gulp.src(webpackDistConfig.entry.app)
    .pipe(webpack(webpackDistConfig))
    .on('error', err => this.emit('end')) // Recover from errors
    .pipe(gulp.dest(`${paths.dist}/client`))
})

gulp.task('webpack:test', () => {
  const webpackTestConfig = makeWebpackConfig({TEST: true})

  return gulp.src(webpackTestConfig.entry.app)
    .pipe(webpack(webpackTestConfig))
    .pipe(gulp.dest('.tmp'))
})

gulp.task('webpack:e2e', () => {
  const webpackE2eConfig = makeWebpackConfig({E2E: true})

  return gulp.src(webpackE2eConfig.entry.app)
    .pipe(webpack(webpackE2eConfig))
    .pipe(gulp.dest('.tmp'))
})

gulp.task('transpile:server', () => gulp.src(_.union(paths.server.scripts, paths.server.json))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel({
    plugins: ['transform-class-properties', 'transform-runtime']
  }))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(`${paths.dist}/${serverPath}`)))

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb))

gulp.task('lint:scripts:client', () => gulp.src(_.union(paths.client.scripts, _.map(paths.client.test, blob => `!${blob}`)))
  .pipe(plugins.eslint(`${clientPath}/.eslintrc`))
  .pipe(plugins.eslint.format()))

gulp.task('lint:scripts:server', () => gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => `!${blob}`)))
  .pipe(plugins.eslint(`${serverPath}/.eslintrc`))
  .pipe(plugins.eslint.format()))

gulp.task('lint:scripts:clientTest', () => gulp.src(paths.client.test)
  .pipe(plugins.eslint({
    configFile: `${clientPath}/.eslintrc`,
    envs: ['browser', 'es6', 'mocha']
  }))
  .pipe(plugins.eslint.format()))

gulp.task('lint:scripts:serverTest', () => gulp.src(_.union(paths.server.test.integration, paths.server.test.unit))
  .pipe(plugins.eslint({
    configFile: `${serverPath}/.eslintrc`,
    envs: ['node', 'es6', 'mocha']
  }))
  .pipe(plugins.eslint.format()))

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}))

gulp.task('start:client', cb => {
  whenServerReady(() => {
    open(`http://localhost:${config.browserSyncPort}`)
    cb()
  })
})

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${serverPath}/config/environment`)

  nodemon(`-w ${serverPath} ${serverPath}`)
})

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  config = require(`./${paths.dist}/${serverPath}/config/environment`)

  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
})

gulp.task('start:server:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${serverPath}/config/environment`)

  nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
})

gulp.task('watch', () => {
  gulp.watch(paths.client.scripts, ['lint:scripts:client'])
  gulp.watch(paths.server.scripts, ['lint:scripts:server'])
  gulp.watch(paths.client.test, ['lint:scripts:clientTest'])
  gulp.watch(_.union(paths.server.test.integration, paths.server.test.unit), ['lint:scripts:serverTest'])
})

gulp.task('serve', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'],
  ['start:server', 'start:client'], 'watch', cb))

gulp.task('serve:debug', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'],
  'webpack:dev', ['start:server:debug', 'start:client'], 'watch', cb))

gulp.task('serve:dist', cb => runSequence('build', 'env:all', 'env:prod', ['start:server:prod', 'start:client'], cb))

gulp.task('test', cb => runSequence('test:server', 'test:client', cb))

gulp.task('test:server', cb => runSequence('env:all', 'env:test', 'mocha:unit', 'mocha:integration', cb))

gulp.task('mocha:unit', () => gulp.src(paths.server.test.unit)
  .pipe(mocha()))

gulp.task('mocha:integration', () => gulp.src(paths.server.test.integration)
  .pipe(mocha()))

gulp.task('test:server:coverage', cb => runSequence('coverage:pre', 'env:all', 'env:test', 'coverage:unit',
  'coverage:integration', cb))

gulp.task('coverage:pre', () => gulp.src(paths.server.scripts)
  .pipe(plugins.istanbul({
    instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
    includeUntested: true
  }))
  .pipe(plugins.istanbul.hookRequire()))

gulp.task('coverage:unit', () => gulp.src(paths.server.test.unit)
  .pipe(mocha())
  .pipe(istanbul()))

gulp.task('coverage:integration', () => gulp.src(paths.server.test.integration)
  .pipe(mocha())
  .pipe(istanbul()))

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update)

gulp.task('test:e2e', ['webpack:e2e', 'env:all', 'env:test', 'start:server', 'webdriver_update'], cb => {
  gulp.src(paths.client.e2e)
    .pipe(protractor({configFile: 'protractor.conf.js'}))
    .on('error', e => { throw e })
    .on('end', () => { process.exit() })
})

gulp.task('test:client', done => {
  new KarmaServer({
    configFile: `${__dirname}/${paths.karma}`,
    singleRun: true
  }, err => {
    done(err)
    process.exit(err)
  }).start()
})

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(['clean:dist', 'clean:tmp'], 'transpile:server', ['build:images'],
    ['copy:extras', 'copy:assets', 'copy:server', 'webpack:dist'], 'revReplaceWebpack', cb)
})

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}))

gulp.task('build:images', () => gulp.src(paths.client.images)
  .pipe(plugins.imagemin([
    plugins.imagemin.optipng({optimizationLevel: 5}),
    plugins.imagemin.jpegtran({progressive: true}),
    plugins.imagemin.gifsicle({interlaced: true}),
    plugins.imagemin.svgo({plugins: [{removeViewBox: false}]})
  ]))
  .pipe(plugins.rev())
  .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
  .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
    base: `${paths.dist}/${clientPath}/assets`,
    merge: true
  }))
  .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`)))

gulp.task('revReplaceWebpack', () => gulp.src('dist/client/app.*.js')
  .pipe(plugins.revReplace({manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)}))
  .pipe(gulp.dest('dist/client')))

gulp.task('copy:extras', () => gulp.src([`${clientPath}/favicon.ico`, `${clientPath}/robots.txt`, `${clientPath}/.htaccess`], {dot: true})
  .pipe(gulp.dest(`${paths.dist}/${clientPath}`)))

gulp.task('copy:assets', () => gulp.src([paths.client.assets, `!${paths.client.images}`, `!${paths.client.styles}`])
  .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`)))

gulp.task('copy:server', () => gulp.src(['package.json', paths.server.template], {cwdbase: true})
  .pipe(gulp.dest(paths.dist)))
