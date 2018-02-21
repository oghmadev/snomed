'use strict'

export default function (db) {
  db.Description.Module = db.Description.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Description.Concept = db.Description.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'conceptId'
    },
    as: 'concept',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Description.Type = db.Description.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'typeId'
    },
    as: 'type',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Description.CaseSignificance = db.Description.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'caseSignificanceId'
    },
    as: 'caseSignificance',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Description.removeAttribute('createdAt')
  db.Description.removeAttribute('updatedAt')
}
