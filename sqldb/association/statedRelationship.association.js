'use strict'

export default function (db) {
  db.StatedRelationship.Module = db.StatedRelationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.StatedRelationship.Source = db.StatedRelationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    as: 'source',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.StatedRelationship.Destination = db.StatedRelationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    as: 'destination',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.StatedRelationship.Type = db.StatedRelationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.StatedRelationship.CharacteristicType = db.StatedRelationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    as: 'characteristicType',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.StatedRelationship.Modifier = db.StatedRelationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    as: 'modifier',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.StatedRelationship.removeAttribute('createdAt')
  db.StatedRelationship.removeAttribute('updatedAt')
}
