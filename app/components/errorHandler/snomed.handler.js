'use strict'

import logger from '../../config/logs'

export default function SNOMEDErrorHandler (error) {
  logger.snomed.console.error(`${error.name}: ${error.message}`)
  logger.snomed.error.log(Object.assign({
    level: 'error',
    timestamp: (new Date()).toISOString()
  }, {stack: error.stack}, error))

  return {message: error.message}
}
