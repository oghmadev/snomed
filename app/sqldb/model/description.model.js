'use strict'

import { SNOMED } from '../enum'

export default function (sequelize, DataTypes) {
  return sequelize.define('description', {
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
    languageCode: {
      type: DataTypes.ENUM(SNOMED.LANGUAGE_CODE),
      allowNull: false
    },
    term: {
      type: DataTypes.STRING(2048),
      allowNull: false
    }
  }, {tableName: 'Description'})
}
