'use strict'

export default function (db) {
  db.Concept.Subtype = db.Concept.belongsToMany(db.Concept, {
    foreignKey: 'supertypeId',
    otherKey: 'subtypeId',
    through: 'TransitiveClosure',
    onDelete: 'CASCADE',
    as: 'subtypeTransitiveClosure',
    hooks: true
  })

  db.Concept.Supertype = db.Concept.belongsToMany(db.Concept, {
    foreignKey: 'subtypeId',
    otherKey: 'supertypeId',
    through: 'TransitiveClosure',
    onDelete: 'CASCADE',
    as: 'supertypeTransitiveClosure',
    hooks: true
  })
}
