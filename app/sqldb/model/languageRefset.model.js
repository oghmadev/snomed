'use strict'

export default function (sequelize, DataTypes) {
  return sequelize.define('languageRefset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
  }, {tableName: 'LanguageRefset'})
}
