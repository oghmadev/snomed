'use strict'

export default function (db) {
  db.TextDefinition.Module = db.TextDefinition.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.TextDefinition.Concept = db.TextDefinition.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    as: 'concept',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.TextDefinition.Type = db.TextDefinition.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.TextDefinition.CaseSignificance = db.TextDefinition.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    as: 'caseSignificance',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.TextDefinition.removeAttribute('createdAt')
  db.TextDefinition.removeAttribute('updatedAt')
}
