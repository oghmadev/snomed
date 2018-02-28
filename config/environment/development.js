'use strict'

import path from 'path'

const filesDir = path.dirname(require.main.filename).split('/')
const logsPath = `${filesDir.join('/')}/logs`
const sqlPath = `${filesDir.join('/')}/sql`

module.exports = {
  sequelize: {
    database: 'snomed-dev',
    username: 'snomed-dev',
    password: 'test',
    options: {
      host: 'localhost',
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
  logsPath: logsPath,
  sqlPath: sqlPath,
  commonLogLevel: 'info',
  logMaxSize: 1024 * 1024 * 100
}
