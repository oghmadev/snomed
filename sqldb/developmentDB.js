'use strict'

import config from '../config/environment'
import logger from '../config/logs'
import fs from 'fs'

const EXTENSIONS_PATH = `${config.sqlPath}/extensions`
const STORED_PROCEDURES_PATH = `${config.sqlPath}/storedProcedures`
const TRIGGERS_PATH = `${config.sqlPath}/triggers`
const VIEWS_PATH = `${config.sqlPath}/views`

export default function DevelopmentDB (sequelize) {
  function readFile (path, message) {
    return (resolve, reject) => {
      return fs.readFile(path, 'utf-8', (err, data) => {
        if (err != null) return reject(err)

        const promise = sequelize.query(data)
          .then(() => logger.common.info(message))
          .catch(err => logger.common.warn(err))

        return resolve(promise)
      })
    }
  }

  return new Promise(readFile(`${EXTENSIONS_PATH}/unnacent.sql`, 'Unaccent installed succesfully.'))
    .then(() => new Promise(readFile(`${STORED_PROCEDURES_PATH}/medicationRequest.procedure.sql`, 'medicationRequest: Stored Procedure installed succesfully.')))
    .then(() => new Promise(readFile(`${STORED_PROCEDURES_PATH}/appointment.procedure.sql`, 'appointment: Stored Procedure installed succesfully.')))
    .then(() => new Promise(readFile(`${TRIGGERS_PATH}/appointment.trigger.sql`, 'Trigger installed succesfully.')))
    .then(() => new Promise(readFile(`${VIEWS_PATH}/snomedFinding.view.sql`, 'View installed succesfully.')))
    .catch(err => logger.common.error(err))
}
