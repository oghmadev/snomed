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
const appPath = 'app'
const dataPath = 'data'
const distPath = 'dist'
const dockerPath = 'docker'
const test = 'test'
const scripts = {
  app: [`${appPath}/**/!(*.spec|*.integration).js`],
  test: {
    integration: [`${test}/**/*.integration.js`],
    unit: [`${test}/**/*.spec.js`]
  }
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
    localConfig = require(`./${appPath}/config/local.env`)
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

gulp.task('transpile', () => gulp.src(scripts.app)
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel({
    plugins: ['transform-class-properties', 'transform-runtime']
  }))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(`${distPath}/${appPath}`)))

gulp.task('lint:scripts', () => gulp.src(_.union(scripts.app, _.map(scripts.test, blob => `!${blob}`)))
  .pipe(plugins.eslint(`.eslintrc`))
  .pipe(plugins.eslint.format()))

gulp.task('lint:scripts:test', () => gulp.src(_.union(scripts.test.integration, scripts.test.unit))
  .pipe(plugins.eslint({
    configFile: `.eslintrc`,
    envs: ['node', 'es6', 'mocha']
  }))
  .pipe(plugins.eslint.format()))

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}))

gulp.task('start', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${appPath}/config/environment`)

  nodemon(`-w ${appPath} ${appPath}`)
})

gulp.task('start:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  config = require(`./${distPath}/config/environment`)

  nodemon(`-w ${distPath}/${appPath} ${distPath}/${appPath}`)
})

gulp.task('start:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${appPath}/config/environment`)

  nodemon(`-w ${appPath} --debug=5858 --debug-brk ${appPath}`)
})

gulp.task('watch', () => {
  gulp.watch(scripts.app, ['lint:scripts'])
  gulp.watch(_.union(scripts.test.integration, scripts.test.unit), ['lint:scripts:test'])
})

gulp.task('serve', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'], ['start'], 'watch', cb))

gulp.task('serve:debug', cb => runSequence(['clean:tmp', 'lint:scripts', 'env:all'], ['start:debug'], 'watch', cb))

gulp.task('serve:dist', cb => runSequence('build', 'env:all', 'env:prod', ['start:prod'], cb))

gulp.task('test', cb => runSequence('env:all', 'env:test', 'mocha:unit', 'mocha:integration', cb))

gulp.task('mocha:unit', () => gulp.src(scripts.test.unit)
  .pipe(mocha()))

gulp.task('mocha:integration', () => gulp.src(scripts.test.integration)
  .pipe(mocha()))

gulp.task('test:server:coverage', cb => runSequence('coverage:pre', 'env:all', 'env:test', 'coverage:unit',
  'coverage:integration', cb))

gulp.task('coverage:pre', () => gulp.src(scripts.app)
  .pipe(plugins.istanbul({
    instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
    includeUntested: true
  }))
  .pipe(plugins.istanbul.hookRequire()))

gulp.task('coverage:unit', () => gulp.src(scripts.test.unit)
  .pipe(mocha())
  .pipe(istanbul()))

gulp.task('coverage:integration', () => gulp.src(scripts.test.integration)
  .pipe(mocha())
  .pipe(istanbul()))

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update)

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(['clean:dist', 'clean:tmp'], 'transpile', ['copy', 'copy:data', 'copy:docker'], cb)
})

gulp.task('clean:dist', () => del([`${distPath}/!(.git*|.openshift|Procfile)**`], {dot: true}))

gulp.task('copy', () => gulp.src(['package.json', 'package-lock.json'], {cwdbase: true})
  .pipe(gulp.dest(distPath)))

gulp.task('copy:data', () => gulp.src([`${dataPath}/**/*`], {cwdbase: true})
  .pipe(gulp.dest(distPath)))

gulp.task('copy:docker', () => gulp.src([`${dockerPath}/staging/**/*`, `${dockerPath}/staging/.env`])
  .pipe(gulp.dest(distPath)))
