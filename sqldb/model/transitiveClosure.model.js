'use strict'

export default function (sequelize) {
  return sequelize.define('transitiveClosure', {}, {tableName: 'TransitiveClosure'})
}
