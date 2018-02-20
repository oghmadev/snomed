'use strict'

import winston from 'winston'
import config from '../../config/environment'

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [new winston.transports.File({
    filename: `${config.logsPath}/sirona.error.log`,
    maxsize: config.logMaxSize
  })]
})

const serverLogger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => `${(new Date()).toISOString()},${info.message}`),
  transports: [new winston.transports.File({
    filename: `${config.logsPath}/sirona.server.log`,
    maxsize: config.logMaxSize
  })]
})

const consoleLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.colorize(), winston.format.printf(info => `${(new Date()).toISOString()} - ${info.level}: ${info.message}`)),
  transports: [new winston.transports.Console()]
})

export default {
  error: errorLogger,
  server: serverLogger,
  console: consoleLogger
}
