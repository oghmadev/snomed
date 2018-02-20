'use strict'

export default function (db) {
  db.SNOMEDRelationship.Module = db.SNOMEDRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDRelationship.Source = db.SNOMEDRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    as: 'source',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDRelationship.Destination = db.SNOMEDRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    as: 'destination',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDRelationship.Type = db.SNOMEDRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDRelationship.CharacteristicType = db.SNOMEDRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    as: 'characteristicType',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDRelationship.Modifier = db.SNOMEDRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    as: 'modifier',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDRelationship.removeAttribute('createdAt')
  db.SNOMEDRelationship.removeAttribute('updatedAt')
}
