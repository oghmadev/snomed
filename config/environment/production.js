'use strict'

import path from 'path'

const filesDir = path.dirname(require.main.filename).split('/')
filesDir.pop()
filesDir.pop()

const dataPath = `${filesDir.join('/')}/data`
const logsPath = `${filesDir.join('/')}/logs`

module.exports = {
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.ip || undefined,
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 8080,
  sequelize: {
    database: 'snomed-prod',
    username: 'userProd',
    password: 'test',
    options: {
      host: 'localhost',
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
