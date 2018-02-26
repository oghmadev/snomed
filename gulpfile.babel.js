'use strict'

import _ from 'lodash'
import del from 'del'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import lazypipe from 'lazypipe'
import nodemon from 'nodemon'
import runSequence from 'run-sequence'
import { webdriver_update } from 'gulp-protractor'
import { Instrumenter } from 'isparta'
import webpack from 'webpack-stream'

let config
const plugins = gulpLoadPlugins()
const serverPath = '.'
const paths = {
  server: {
    scripts: [`${serverPath}/**/!(*.spec|*.integration).js`, `!${serverPath}/config/local.env.sample.js`],
    json: [`${serverPath}/**/*.json`],
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

gulp.task('transpile:server', () => gulp.src(_.union(paths.server.scripts, paths.server.json))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel({
    plugins: ['transform-class-properties', 'transform-runtime']
  }))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(`${paths.dist}/${serverPath}`)))

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:server'], cb))

gulp.task('lint:scripts:server', () => gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => `!${blob}`)))
  .pipe(plugins.eslint(`${serverPath}/.eslintrc`))
  .pipe(plugins.eslint.format()))

gulp.task('lint:scripts:serverTest', () => gulp.src(_.union(paths.server.test.integration, paths.server.test.unit))
  .pipe(plugins.eslint({
    configFile: `${serverPath}/.eslintrc`,
    envs: ['node', 'es6', 'mocha']
  }))
  .pipe(plugins.eslint.format()))

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}))

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
  gulp.watch(paths.server.scripts, ['lint:scripts:server'])
  gulp.watch(_.union(paths.server.test.integration, paths.server.test.unit), ['lint:scripts:serverTest'])
})

gulp.task('serve', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'], ['start:server'], 'watch', cb))

gulp.task('serve:debug', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'],
  'webpack:dev', ['start:server:debug'], 'watch', cb))

gulp.task('serve:dist', cb => runSequence('build', 'env:all', 'env:prod', ['start:server:prod'], cb))

gulp.task('test', cb => runSequence('test:server', cb))

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

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(['clean:dist', 'clean:tmp'], 'transpile:server', ['build:images'],
    ['copy:extras', 'copy:assets', 'copy:server', 'webpack:dist'], 'revReplaceWebpack', cb)
})

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}))

gulp.task('copy:server', () => gulp.src(['package.json', paths.server.template], {cwdbase: true})
  .pipe(gulp.dest(paths.dist)))
