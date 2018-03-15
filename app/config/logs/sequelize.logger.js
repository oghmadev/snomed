'use strict'

import winston from 'winston'
import config from '../../config/environment'

const fileLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [new winston.transports.File({
    filename: `${config.logsPath}/database.error.log`,
    maxsize: config.logMaxSize,
    maxFiles: config.logMaxFiles,
    tailable: true
  })]
})

const consoleLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.colorize(), winston.format.printf(info => `${(new Date()).toISOString()} - ${info.level}: ${info.message}`)),
  transports: [new winston.transports.Console()]
})

export default {
  file: fileLogger,
  console: consoleLogger
}
