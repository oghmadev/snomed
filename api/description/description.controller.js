'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function getFSN (req, res) {
  return utils.checkToggle('description')
    .then(() => {
      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getFSN.name,
          message: 'description.conceptId.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description
                     WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE AND
                           description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN}
                     ORDER BY description.term ASC;`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getSynonyms (req, res) {
  return utils.checkToggle('description')
    .then(() => {
      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getSynonyms.name,
          message: 'description.conceptId.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description
                     WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE AND
                           description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM}
                     ORDER BY description.term ASC;`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getComplete (req, res) {
  return utils.checkToggle('description')
    .then(() => {
      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getComplete.name,
          message: 'description.conceptId.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description
                     WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE
                     ORDER BY description.term ASC;`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(concepts => {
      return concepts.filter(c => c.typeId === constants.SNOMED.TYPES.DESCRIPTION.FSN)
        .map(concept => {
          concept.synonyms = concepts.filter(c => c.typeId === constants.SNOMED.TYPES.DESCRIPTION.SYNONYM && c.conceptId === concept.conceptId)

          return concept
        })[0]
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDescription (req, res) {
  return utils.checkToggle('description')
    .then(() => {
      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getDescription.name,
          message: 'description.conceptId.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description
                     WHERE description."id" = ${req.params.id} AND description.active = TRUE;`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(results => {
      if (results.length > 1) return results
      else return results[0]
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
