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

let config
const plugins = gulpLoadPlugins()
const paths = {
  scripts: [`./app.js`, `./index.js`, `./(api|component|config)/**/!(*.spec|*.integration).js`, `!./config/local.env.sample.js`],
  test: {
    integration: [`./**/*.integration.js`, 'mocha.global.js'],
    unit: [`./**/*.spec.js`, 'mocha.global.js']
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
    localConfig = require(`./config/local.env`)
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

gulp.task('transpile', () => gulp.src(paths.scripts)
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel({
    plugins: ['transform-class-properties', 'transform-runtime']
  }))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(`${paths.dist}`)))

gulp.task('lint:scripts', () => gulp.src(_.union(paths.scripts, _.map(paths.test, blob => `!${blob}`)))
  .pipe(plugins.eslint(`.eslintrc`))
  .pipe(plugins.eslint.format()))

gulp.task('lint:scripts:test', () => gulp.src(_.union(paths.test.integration, paths.test.unit))
  .pipe(plugins.eslint({
    configFile: `.eslintrc`,
    envs: ['node', 'es6', 'mocha']
  }))
  .pipe(plugins.eslint.format()))

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}))

gulp.task('start', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./config/environment`)

  nodemon(`-w . .`)
})

gulp.task('start:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  config = require(`./${paths.dist}/config/environment`)

  nodemon(`-w ${paths.dist} ${paths.dist}`)
})

gulp.task('start:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./config/environment`)

  nodemon(`-w . --debug=5858 --debug-brk .`)
})

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['lint:scripts'])
  gulp.watch(_.union(paths.test.integration, paths.test.unit), ['lint:scripts:test'])
})

gulp.task('serve', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'], ['start'], 'watch', cb))

gulp.task('serve:debug', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'], ['start:debug'], 'watch', cb))

gulp.task('serve:dist', cb => runSequence('build', 'env:all', 'env:prod', ['start:prod'], cb))

gulp.task('test', cb => runSequence('env:all', 'env:test', 'mocha:unit', 'mocha:integration', cb))

gulp.task('mocha:unit', () => gulp.src(paths.test.unit)
  .pipe(mocha()))

gulp.task('mocha:integration', () => gulp.src(paths.test.integration)
  .pipe(mocha()))

gulp.task('test:server:coverage', cb => runSequence('coverage:pre', 'env:all', 'env:test', 'coverage:unit',
  'coverage:integration', cb))

gulp.task('coverage:pre', () => gulp.src(paths.scripts)
  .pipe(plugins.istanbul({
    instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
    includeUntested: true
  }))
  .pipe(plugins.istanbul.hookRequire()))

gulp.task('coverage:unit', () => gulp.src(paths.test.unit)
  .pipe(mocha())
  .pipe(istanbul()))

gulp.task('coverage:integration', () => gulp.src(paths.test.integration)
  .pipe(mocha())
  .pipe(istanbul()))

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update)

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(['clean:dist', 'clean:tmp'], 'transpile', ['copy'], 'revReplaceWebpack', cb)
})

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}))

gulp.task('copy', () => gulp.src(['package.json', 'package-lock.json'], {cwdbase: true})
  .pipe(gulp.dest(paths.dist)))
