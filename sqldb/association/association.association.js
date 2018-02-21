'use strict'

export default function (db) {
  db.Associaton.Module = db.Associaton.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'moduleId'
    },
    as: 'module',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Associaton.Refset = db.Associaton.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'refsetId'
    },
    as: 'refset',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Associaton.ReferenceComponent = db.Associaton.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'referenceComponentId'
    },
    as: 'referenceComponent',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Associaton.TargetComponent = db.Associaton.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      name: 'targetComponentId'
    },
    as: 'targetComponent',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.Associaton.removeAttribute('createdAt')
  db.Associaton.removeAttribute('updatedAt')
}
