'use strict'

import association from './association.association'
import concept from './concept.association'
import description from './description.association'
import relationship from './relationship.association'
import statedRelationship from './statedRelationship.association'
import textDescription from './textDescription.association'
import languageRefset from './languageRefset.association'

export default function (db) {
  association(db)
  concept(db)
  description(db)
  relationship(db)
  statedRelationship(db)
  textDescription(db)
  languageRefset(db)
}
