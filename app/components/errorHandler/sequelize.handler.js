'use strict'

import logger from '../../config/logs'

export default function SequelizeErrorHandler (error) {
  logger.sequelize.console.error(error.name)
  logger.sequelize.file.log(Object.assign({
    level: 'error',
    timestamp: (new Date()).toISOString()
  }, {stack: error.stack}, error))

  return {message: `sequelize.${error.name}.error`}
}
