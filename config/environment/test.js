'use strict'

module.exports = {
  sequelize: {
    database: 'sisa-test',
    username: 'userTest',
    password: 'test',
    options: {
      host: 'localhost',
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    }
  }
}
