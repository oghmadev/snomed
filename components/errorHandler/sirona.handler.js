'use strict'

import logger from '../../config/logs'

export default function SironaErrorHandler (error) {
  logger.sirona.console.error(`${error.name}: ${error.message}`)
  logger.sirona.error.log(Object.assign({
    level: 'error',
    timestamp: (new Date()).toISOString()
  }, {stack: error.stack}, error))

  return {message: error.message}
}
