'use strict'

import express from 'express'
import sqldb from './sqldb'
import config from './config/environment'
import http from 'http'
import fs from 'fs'
import logger from './config/logs'
import errorHandler from './components/errorHandler'

if (!fs.existsSync(config.logsPath)) fs.mkdirSync(config.logsPath)

const app = express()
const server = http.createServer(app)

require('./config/express').default(app)
require('./routes').default(app)

function startServer () {
  app.snomedService = server.listen(config.port, config.ip, () => logger.common.info(`Express server listening on ${config.port}, in ${app.get('env')} mode`))
}

sqldb.sequelize.sync()
  .then(startServer)
  .catch(err => logger.common.error(`Server failed to start due to error: ${err}`))

const unhandledRejections = new Map()

process
  .on('unhandledRejection', (reason, promise) => {
    logger.node.console.error(`Possibly Unhandled Rejection at: Promise ${promise}, reason: ${reason}`)
    unhandledRejections.set(promise, reason)
  })
  .on('rejectionHandled', promise => unhandledRejections.delete(promise))
  .on('uncaughtException', error => {
    errorHandler(error)
    process.exit(1)
  })

exports = module.exports = app
