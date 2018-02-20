'use strict'

import { SNOMED } from '../enum'

export default function (sequelize, DataTypes) {
  return sequelize.define('snomedDescription', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    languageCode: {
      type: DataTypes.ENUM(SNOMED.LANGUAGE_CODE),
      allowNull: false
    },
    term: {
      type: DataTypes.STRING(2048),
      allowNull: false
    }
  }, {tableName: 'SNOMEDDescription'})
}
