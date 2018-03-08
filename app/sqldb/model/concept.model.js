'use strict'

export default function (sequelize, DataTypes) {
  return sequelize.define('concept', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    effectiveTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {tableName: 'Concept'})
}
