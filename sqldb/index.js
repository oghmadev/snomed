'use strict'

import config from '../config/environment'
import Sequelize from 'sequelize'
import Associations from './association'

const db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, config.sequelize.options)
}

db.Concept = db.sequelize.import('./model/concept.model')
db.Description = db.sequelize.import('./model/description.model')
db.Relationship = db.sequelize.import('./model/relationship.model')
db.TextDefinition = db.sequelize.import('./model/textDefinition.model')
db.StatedRelationship = db.sequelize.import('./model/statedRelationship.model')
db.LanguageRefset = db.sequelize.import('./model/languageRefset.model')
db.Associaton = db.sequelize.import('./model/association.model')

Associations(db)

module.exports = db
