'use strict'

import path from 'path'

const filesDir = path.dirname(require.main.filename).split('/')

filesDir.pop()

const dataPath = `${filesDir.join('/')}/data`
const logsPath = `${filesDir.join('/')}/logs`

module.exports = {
  sequelize: {
    database: 'snomed-dev',
    username: 'snomed-dev',
    password: 'test',
    options: {
      host: 'snomed-db',
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      // Comment line below to enable sequelize logging
      logging: false
    }
  },
  dataPath: dataPath,
  logsPath: logsPath,
  commonLogLevel: 'info',
  logMaxSize: 1024 * 1024 * 100
}
