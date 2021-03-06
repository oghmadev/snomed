'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamInvalidError } from '../../components/errors'
import constants from '../../components/constants'

export function countDisorderByCriteria (req, res) {
  const criteria = req.query.criteria.trim()
    .split(/\s/)
    .join('%')

  const query = `WITH temp AS (SELECT DISTINCT description."conceptId"
                               FROM "TransitiveClosure" "transitiveClosure", "Description" description
                               WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.DISORDER} AND 
                                     description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM} AND 
                                     "transitiveClosure"."subtypeId" = description."conceptId" AND 
                                     unaccent(description."term") ILIKE unaccent('%${criteria}%') AND
                                     description.active = TRUE)
                 SELECT COUNT(*)
                 FROM temp;`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(results => Number(results[0].count))
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDisorderByCriteria (req, res) {
  return new Promise((resolve, reject) => {
    const invalidParams = []

    if (isNaN(req.query.skip)) invalidParams.push('skip')
    if (isNaN(req.query.limit)) invalidParams.push('limit')

    if (invalidParams.length > 0) {
      return reject(new APIParamInvalidError({
        invalidParams: invalidParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getDisorderByCriteria.name,
        message: 'disorder.params.invalid'
      }))
    }

    const criteria = req.query.criteria.trim()
      .split(/\s/)
      .join('%')

    const query = `WITH concepts AS (SELECT
                                       DISTINCT description."conceptId",
                                       (levenshtein('${req.query.criteria.trim()}', description.term)) AS distance
                                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                                     WHERE description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM} AND
                                           unaccent(description.term) ILIKE unaccent('%${criteria}%') AND
                                           "transitiveClosure"."subtypeId" = description."conceptId" AND
                                           description.active = TRUE AND
                                           "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.DISORDER}
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

    return resolve(sequelize.query(query, {type: sequelize.QueryTypes.SELECT}))
  })
    .then(utils.buildConceptStructure)
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDisorderSynonymByCriteria (req, res) {
  const criteria = req.query.criteria.trim()
    .split(/\s/)
    .join('%')

  const query = `SELECT 
                   description.id, 
                   description."conceptId", 
                   description.term, 
                   description."typeId"
                 FROM "TransitiveClosure" "transitiveClosure", "Description" description
                 WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.DISORDER} AND 
                       "transitiveClosure"."subtypeId" = description."conceptId" AND description.active = TRUE AND
                       unaccent(description."term") ILIKE unaccent('%${criteria}%') AND 
                       description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM}
                 ORDER BY levenshtein('${req.query.criteria.trim()}', description.term) ASC
                 LIMIT 10
                 OFFSET 0;`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
