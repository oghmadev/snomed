'use strict'

import winston from 'winston'
import config from '../../config/environment'

const commonFormat = winston.format.printf(info => `${(new Date()).toISOString()} - ${info.level}: ${info.message}`)

export default winston.createLogger({
  level: config.commonLogLevel || 'info',
  format: winston.format.combine(winston.format.colorize(), commonFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${config.logsPath}/common.error.log`,
      maxsize: config.logMaxSize,
      level: 'error'
    })
  ]
})
