'use strict'

import winston from 'winston'
import config from '../../config/environment'

export default winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => info.message),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${config.logsPath}/express.error.log`,
      maxsize: config.logMaxSize,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `${config.logsPath}/express.log`,
      maxsize: config.logMaxSize,
      level: 'info'
    })]
})
