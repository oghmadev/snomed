'use strict'

import config from '../config/environment'
import Sequelize from 'sequelize'
import Associations from './association'

const db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, config.sequelize.options)
}

db.Association = db.sequelize.import('./model/association.model')
db.Concept = db.sequelize.import('./model/concept.model')
db.Description = db.sequelize.import('./model/description.model')
db.LanguageRefset = db.sequelize.import('./model/languageRefset.model')
db.Relationship = db.sequelize.import('./model/relationship.model')
db.StatedRelationship = db.sequelize.import('./model/statedRelationship.model')
db.TextDefinition = db.sequelize.import('./model/textDefinition.model')
db.TransitiveClosure = db.sequelize.import('./model/transitiveClosure.model')

Associations(db)

module.exports = db
