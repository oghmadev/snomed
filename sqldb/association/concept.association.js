'use strict'

export default function (db) {
  db.Concept.Module = db.Concept.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.DefinitionStatus = db.Concept.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'definitionStatusId'
    },
    as: 'definitionStatus',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.DescriptionModule = db.Concept.hasMany(db.Description, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.DescriptionConcept = db.Concept.hasMany(db.Description, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    as: 'description',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.DescriptionType = db.Concept.hasMany(db.Description, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.DescriptionCaseSignificance = db.Concept.hasMany(db.Description, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.RelationshipModule = db.Concept.hasMany(db.Relationship, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.RelationshipSource = db.Concept.hasMany(db.Relationship, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    as: 'source',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.RelationshipDestination = db.Concept.hasMany(db.Relationship, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    as: 'destination',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.RelationshipType = db.Concept.hasMany(db.Relationship, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.RelationshipCharacteristicType = db.Concept.hasMany(db.Relationship, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.RelationshipModifier = db.Concept.hasMany(db.Relationship, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.TextDefinitionModule = db.Concept.hasMany(db.TextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.TextDefinitionConcept = db.Concept.hasMany(db.TextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.TextDefinitionType = db.Concept.hasMany(db.TextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.TextDefinitionCaseSignificance = db.Concept.hasMany(db.TextDefinition, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.StatedRelationshipModule = db.Concept.hasMany(db.StatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.StatedRelationshipSource = db.Concept.hasMany(db.StatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'sourceId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.StatedRelationshipDestination = db.Concept.hasMany(db.StatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'destinationId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.StatedRelationshipType = db.Concept.hasMany(db.StatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.StatedRelationshipCharacteristicType = db.Concept.hasMany(db.StatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'characteristicTypeId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.StatedRelationshipModifier = db.Concept.hasMany(db.StatedRelationship, {
    foreignKey: {
      allowNull: false,
      name: 'modifierId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.LanguageRefsetModule = db.Concept.hasMany(db.LanguageRefset, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.LanguageRefsetRefset = db.Concept.hasMany(db.LanguageRefset, {
    foreignKey: {
      allowNull: false,
      name: 'refsetId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.LanguageRefsetReferencedComponent = db.Concept.hasMany(db.LanguageRefset, {
    foreignKey: {
      allowNull: false,
      name: 'referencedComponentId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.LanguageRefsetAcceptability = db.Concept.hasMany(db.LanguageRefset, {
    foreignKey: {
      allowNull: false,
      name: 'acceptabilityId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.AssociationModule = db.Concept.hasMany(db.Association, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.AssociationRefset = db.Concept.hasMany(db.Association, {
    foreignKey: {
      allowNull: false,
      name: 'refsetId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.AssociationReferencedComponent = db.Concept.hasMany(db.Association, {
    foreignKey: {
      allowNull: false,
      name: 'referencedComponentId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.AssociationTargetComponent = db.Concept.hasMany(db.Association, {
    foreignKey: {
      allowNull: false,
      name: 'targetComponentId'
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Concept.removeAttribute('createdAt')
  db.Concept.removeAttribute('updatedAt')
}
