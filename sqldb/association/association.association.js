'use strict'

export default function (db) {
  db.Association.Module = db.Association.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Association.Refset = db.Association.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'refsetId'
    },
    as: 'refset',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Association.ReferenceComponent = db.Association.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'referenceComponentId'
    },
    as: 'referenceComponent',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Association.TargetComponent = db.Association.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'targetComponentId'
    },
    as: 'targetComponent',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Association.removeAttribute('createdAt')
  db.Association.removeAttribute('updatedAt')
}
