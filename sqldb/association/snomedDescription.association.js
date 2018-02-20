'use strict'

export default function (db) {
  db.SNOMEDDescription.Module = db.SNOMEDDescription.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDDescription.Concept = db.SNOMEDDescription.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    as: 'concept',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDDescription.Type = db.SNOMEDDescription.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDDescription.CaseSignificance = db.SNOMEDDescription.belongsTo(db.SNOMEDConcept, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    as: 'caseSignificance',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.SNOMEDDescription.removeAttribute('createdAt')
  db.SNOMEDDescription.removeAttribute('updatedAt')
}
