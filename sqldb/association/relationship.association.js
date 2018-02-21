'use strict'

export default function (db) {
  db.Relationship.Module = db.Relationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Relationship.Source = db.Relationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    as: 'source',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Relationship.Destination = db.Relationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    as: 'destination',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Relationship.Type = db.Relationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Relationship.CharacteristicType = db.Relationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    as: 'characteristicType',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Relationship.Modifier = db.Relationship.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    as: 'modifier',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Relationship.removeAttribute('createdAt')
  db.Relationship.removeAttribute('updatedAt')
}
