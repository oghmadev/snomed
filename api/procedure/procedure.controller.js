'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamInvalidError, APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function countProcedureByCriteria (req, res) {
  return utils.checkToggle('procedure')
    .then(() => {
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: countProcedureByCriteria.name,
          message: 'procedure.criteria.missing'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `WITH temp AS (SELECT DISTINCT description."conceptId"
                                   FROM "TransitiveClosure" "transitiveClosure", "Description" description
                                   WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PROCEDURE} AND 
                                         description.active = TRUE AND 
                                         "transitiveClosure"."subtypeId" = description."conceptId" AND 
                                         unaccent(description."term") ILIKE '%${criteria}%' AND 
                                         description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM})
                     SELECT COUNT(*)
                     FROM temp;`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(results => Number(results[0].count))
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getProcedureByCriteria (req, res) {
  return utils.checkToggle('procedure')
    .then(() => {
      const missingParams = []

      if (req.query.skip == null) missingParams.push('skip')
      if (req.query.limit == null) missingParams.push('limit')
      if (req.query.criteria == null) missingParams.push('criteria')

      if (missingParams.length > 0) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getProcedureByCriteria.name,
          message: 'procedure.criteria.missing'
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
          controllerFunction: getProcedureByCriteria.name,
          message: 'procedure.params.invalid'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `WITH concepts AS (SELECT DISTINCT
                                         description."conceptId",
                                         (levenshtein('${req.query.criteria.trim()}', description.term)) AS distance
                                       FROM "TransitiveClosure" "transitiveClosure", "Description" description
                                       WHERE description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM} AND
                                             description.active = TRUE AND 
                                             unaccent(description.term) ILIKE '%${criteria}%' AND
                                             "transitiveClosure"."subtypeId" = description."conceptId" AND
                                             "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PROCEDURE}
                                       ORDER BY distance ASC
                                       LIMIT ${req.query.limit}
                                       OFFSET ${req.query.skip})
                     SELECT
                       description.id,
                       description."conceptId",
                       description.term,
                       description."typeId"
                     FROM "Description" description, concepts
                     WHERE description."conceptId" = concepts."conceptId";`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(procedures => {
      return procedures.filter(p => p.typeId === constants.SNOMED.TYPES.DESCRIPTION.FSN)
        .map(procedure => {
          procedure.synonyms = procedures.filter(p => p.typeId === constants.SNOMED.TYPES.DESCRIPTION.SYNONYM && p.conceptId === procedure.conceptId)

          return procedure
        })
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getProcedureSynonymByCriteria (req, res) {
  return utils.checkToggle('procedure')
    .then(() => {
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getProcedureSynonymByCriteria.name,
          message: 'disorder.criteria.missing'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `SELECT 
                       description.id,
                       description."conceptId",
                       description.term,
                       description."typeId"
                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                     WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PROCEDURE} AND 
                           description.active = TRUE AND 
                           "transitiveClosure"."subtypeId" = description."conceptId" AND 
                           unaccent(description."term") ILIKE '%${criteria}%' AND 
                           description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM}
                     ORDER BY levenshtein('${req.query.criteria.trim()}', description.term) ASC
                     LIMIT 10
                     OFFSET 0;`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
