'use strict'

export default function (sequelize, DataTypes) {
  return sequelize.define('snomedConcept', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {tableName: 'SNOMEDConcept'})
}
