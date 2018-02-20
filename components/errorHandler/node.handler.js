'use strict'

import logger from '../../config/logs'

export default function NodeErrorHandler (error) {
  logger.node.console.error(error.message)
  logger.node.file.log(Object.assign({
    level: 'error',
    timestamp: (new Date()).toISOString()
  }, {stack: error.stack}, error))

  return {message: error.message}
}
