'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamInvalidError, APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function countDisorderByCriteria (req, res) {
  return utils.checkToggle('disorder')
    .then(() => {
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: countDisorderByCriteria.name,
          message: 'disorder.criteria.missing'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `SELECT COUNT(*)
                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                     WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.DISORDER} AND 
                           description.active = TRUE AND
                           "transitiveClosure"."subtypeId" = description."conceptId" AND 
                           unaccent(description."term") ILIKE '%${criteria}%' AND 
                           description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN};`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(results => Number(results[0].count))
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDisorderByCriteria (req, res) {
  return utils.checkToggle('disorder')
    .then(() => {
      const missingParams = []

      if (req.query.skip == null) missingParams.push('skip')
      if (req.query.limit == null) missingParams.push('limit')
      if (req.query.criteria == null) missingParams.push('criteria')

      if (missingParams.length > 0) {
        throw new APIParamMissingError({
          missingParams: missingParams,
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getDisorderByCriteria.name,
          message: 'disorder.params.missing'
        })
      }

      const invalidParams = []

      if (isNaN(req.query.skip)) invalidParams.push('skip')
      if (isNaN(req.query.limit)) invalidParams.push('limit')

      if (invalidParams.length > 0) {
        throw new APIParamInvalidError({
          invalidParams: invalidParams,
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getDisorderByCriteria.name,
          message: 'disorder.params.invalid'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `WITH FSN AS (SELECT description."conceptId"
                                  FROM "TransitiveClosure" "transitiveClosure", "Description" description
                                  WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.DISORDER} AND 
                                        description.active = TRUE AND
                                        "transitiveClosure"."subtypeId" = description."conceptId" AND 
                                        unaccent(description."term") ILIKE '%${criteria}%' AND 
                                        description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN}
                                  ORDER BY description.term ASC
                                  LIMIT ${req.query.limit}
                                  OFFSET ${req.query.skip})
                     SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description, FSN
                     WHERE description."conceptId" = FSN."conceptId";`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(disorders => {
      return disorders.filter(d => d.typeId === constants.SNOMED.TYPES.DESCRIPTION.FSN)
        .map(disorder => {
          disorder.synonyms = disorders.filter(d => d.typeId === constants.SNOMED.TYPES.DESCRIPTION.SYNONYM && d.conceptId === disorder.conceptId)

          return disorder
        })
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDisorderSynonymByCriteria (req, res) {
  return utils.checkToggle('disorder')
    .then(() => {
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getDisorderSynonymByCriteria.name,
          message: 'disorder.criteria.missing'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                     WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.DISORDER} AND 
                           description.active = TRUE AND "transitiveClosure"."subtypeId" = description."conceptId" AND 
                           unaccent(description."term") ILIKE '%${criteria}%' AND 
                           description."typeId" <> ${constants.SNOMED.TYPES.DESCRIPTION.FSN}
                     ORDER BY description.term ASC
                     LIMIT 10
                     OFFSET 0;`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
