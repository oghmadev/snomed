'use strict'

import winston from 'winston'
import config from '../../config/environment'

const fileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `${config.logsPath}/express.error.log`,
      maxsize: config.logMaxSize,
      maxFiles: config.logMaxFiles,
      tailable: true,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `${config.logsPath}/express.log`,
      maxsize: config.logMaxSize,
      maxFiles: config.logMaxFiles,
      tailable: true,
      level: 'info'
    })]
})

const consoleLogger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => info.message),
  transports: [new winston.transports.Console()]
})

export default {
  file: fileLogger,
  console: consoleLogger
}
