'use strict'

export default function (sequelize, DataTypes) {
  return sequelize.define('snomedStatedRelationship', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    relationshipGroup: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {tableName: 'SNOMEDStatedRelationship'})
}
