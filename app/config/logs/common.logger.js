'use strict'

import winston from 'winston'
import config from '../../config/environment'

const commonFormat = winston.format.printf(info => `${(new Date()).toISOString()} - ${info.level}: ${info.message}`)

const fileLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [new winston.transports.File({
    filename: `${config.logsPath}/common.error.log`,
    maxsize: config.logMaxSize,
    maxFiles: config.logMaxFiles,
    tailable: true,
    level: 'error'
  })]
})

const consoleLogger = winston.createLogger({
  level: config.commonLogLevel || 'info',
  format: winston.format.combine(winston.format.colorize(), commonFormat),
  transports: [new winston.transports.Console()]
})

export default {
  file: fileLogger,
  console: consoleLogger
}
