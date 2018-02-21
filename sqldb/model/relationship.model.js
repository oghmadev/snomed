'use strict'

export default function (sequelize, DataTypes) {
  return sequelize.define('relationship', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    effectiveTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    relationshipGroup: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {tableName: 'Relationship'})
}
