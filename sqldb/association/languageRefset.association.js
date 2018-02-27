'use strict'

export default function (db) {
  db.LanguageRefset.Module = db.LanguageRefset.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.LanguageRefset.Refset = db.LanguageRefset.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'refsetId'
    },
    as: 'refset',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.LanguageRefset.ReferencedComponent = db.LanguageRefset.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'referencedComponentId'
    },
    as: 'referencedComponent',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.LanguageRefset.Acceptability = db.LanguageRefset.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'acceptabilityId'
    },
    as: 'acceptability',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.LanguageRefset.removeAttribute('createdAt')
  db.LanguageRefset.removeAttribute('updatedAt')
}
