'use strict'

import association from './association.association'
import concept from './concept.association'
import description from './description.association'
import languageRefset from './languageRefset.association'
import relationship from './relationship.association'
import statedRelationship from './statedRelationship.association'
import textDescription from './textDescription.association'
import transitiveClosure from './transitiveClosure.association'

export default function (db) {
  association(db)
  concept(db)
  description(db)
  languageRefset(db)
  relationship(db)
  statedRelationship(db)
  textDescription(db)
  transitiveClosure(db)
}
