'use strict'

export default function (db) {
  db.TransitiveClosure.Subtype = db.TransitiveClosure.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      primaryKey: true,
      name: 'subtypeId'
    },
    as: 'subtype',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.TransitiveClosure.Supertype = db.TransitiveClosure.belongsTo(db.Concept, {
    foreignKey: {
      allowNull: false,
      primaryKey: true,
      name: 'supertypeId'
    },
    as: 'supertype',
    onDelete: 'CASCADE',
    hooks: true
  })

  db.TransitiveClosure.removeAttribute('id')
  db.TransitiveClosure.removeAttribute('updatedAt')
  db.TransitiveClosure.removeAttribute('updatedAt')
}
