'use strict'

export default function (db) {
  db.SNOMEDConcept.Module = db.SNOMEDConcept.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.DefinitionStatus = db.SNOMEDConcept.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'definitionStatusId'
    },
    as: 'definitionStatus',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.DescriptionModule = db.SNOMEDConcept.hasMany(db.SNOMEDDescription, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.DescriptionConcept = db.SNOMEDConcept.hasMany(db.SNOMEDDescription, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    as: 'description',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.DescriptionType = db.SNOMEDConcept.hasMany(db.SNOMEDDescription, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.DescriptionCaseSignificance = db.SNOMEDConcept.hasMany(db.SNOMEDDescription, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.RelationshipModule = db.SNOMEDConcept.hasMany(db.SNOMEDRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.RelationshipSource = db.SNOMEDConcept.hasMany(db.SNOMEDRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    as: 'source',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.RelationshipDestination = db.SNOMEDConcept.hasMany(db.SNOMEDRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    as: 'destination',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.RelationshipType = db.SNOMEDConcept.hasMany(db.SNOMEDRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.RelationshipCharacteristicType = db.SNOMEDConcept.hasMany(db.SNOMEDRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.RelationshipModifier = db.SNOMEDConcept.hasMany(db.SNOMEDRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.TextDefinitionModule = db.SNOMEDConcept.hasMany(db.SNOMEDTextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.TextDefinitionConcept = db.SNOMEDConcept.hasMany(db.SNOMEDTextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.TextDefinitionType = db.SNOMEDConcept.hasMany(db.SNOMEDTextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.TextDefinitionCaseSignificance = db.SNOMEDConcept.hasMany(db.SNOMEDTextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.StatedRelationshipModule = db.SNOMEDConcept.hasMany(db.SNOMEDStatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.StatedRelationshipSource = db.SNOMEDConcept.hasMany(db.SNOMEDStatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.StatedRelationshipDestination = db.SNOMEDConcept.hasMany(db.SNOMEDStatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.StatedRelationshipType = db.SNOMEDConcept.hasMany(db.SNOMEDStatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.StatedRelationshipCharacteristicType = db.SNOMEDConcept.hasMany(db.SNOMEDStatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.StatedRelationshipModifier = db.SNOMEDConcept.hasMany(db.SNOMEDStatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDConcept.removeAttribute('createdAt')
  db.SNOMEDConcept.removeAttribute('updatedAt')
}
