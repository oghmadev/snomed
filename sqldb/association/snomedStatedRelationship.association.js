'use strict'

export default function (db) {
  db.SNOMEDStatedRelationship.Module = db.SNOMEDStatedRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDStatedRelationship.Source = db.SNOMEDStatedRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    as: 'source',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDStatedRelationship.Destination = db.SNOMEDStatedRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    as: 'destination',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDStatedRelationship.Type = db.SNOMEDStatedRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDStatedRelationship.CharacteristicType = db.SNOMEDStatedRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    as: 'characteristicType',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDStatedRelationship.Modifier = db.SNOMEDStatedRelationship.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    as: 'modifier',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDStatedRelationship.removeAttribute('createdAt')
  db.SNOMEDStatedRelationship.removeAttribute('updatedAt')
}
