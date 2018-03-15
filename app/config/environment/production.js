'use strict'

import path from 'path'
import dbConf from '/etc/secrets/snomed/db.conf.js'

const filesDir = path.dirname(require.main.filename).split('/')

filesDir.pop()

const dataPath = `${filesDir.join('/')}/data`
const logsPath = `${filesDir.join('/')}/logs`

module.exports = {
  ip: process.env.ip || undefined,
  port: process.env.port || 8080,
  sequelize: {
    database: dbConf.database,
    username: dbConf.username,
    password: dbConf.password,
    options: {
      host: 'snomed-db',
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: false
    }
  },
  dataPath: dataPath,
  logsPath: logsPath,
  commonLogLevel: 'error',
  logMaxSize: 1000 * 1000 * 100,
  logMaxFiles: 10
}
