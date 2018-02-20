'use strict'

export default function (db) {
  db.SNOMEDTextDefinition.Module = db.SNOMEDTextDefinition.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDTextDefinition.Concept = db.SNOMEDTextDefinition.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    as: 'concept',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDTextDefinition.Type = db.SNOMEDTextDefinition.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDTextDefinition.CaseSignificance = db.SNOMEDTextDefinition.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    as: 'caseSignificance',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDTextDefinition.removeAttribute('createdAt')
  db.SNOMEDTextDefinition.removeAttribute('updatedAt')
}
