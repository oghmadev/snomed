'use strict'

import path from 'path'

const filesDir = path.dirname(require.main.filename).split('/')
filesDir.pop()
filesDir.pop()

const logsPath = `${filesDir.join('/')}/logs`
const sqlPath = `${filesDir.join('/')}/sql`

module.exports = {
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.ip || undefined,
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 8080,
  sequelize: {
    database: 'sisa-prod',
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
  logsPath: logsPath,
  sqlPath: sqlPath,
  commonLogLevel: 'error',
  logMaxSize: 1024 * 1024 * 100
}
