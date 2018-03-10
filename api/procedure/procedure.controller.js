'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamInvalidError } from '../../components/errors'
import constants from '../../components/constants'

export function countProcedureByCriteria (req, res) {
  const criteria = req.query.criteria.trim()
    .split(/\s/)
    .join('%')

  const query = `WITH temp AS (SELECT DISTINCT description."conceptId"
                               FROM "TransitiveClosure" "transitiveClosure", "Description" description
                               WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PROCEDURE} AND
                                     "transitiveClosure"."subtypeId" = description."conceptId" AND
                                     description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM} AND
                                     unaccent(description."term") ILIKE '%${criteria}%' AND description.active = TRUE)
                 SELECT COUNT(*)
                 FROM temp;`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(results => Number(results[0].count))
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getProcedureByCriteria (req, res) {
  return new Promise((resolve, reject) => {
    const invalidParams = []

    if (isNaN(req.query.skip)) invalidParams.push('skip')
    if (isNaN(req.query.limit)) invalidParams.push('limit')

    if (invalidParams.length > 0) {
      return reject(new APIParamInvalidError({
        invalidParams: invalidParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getProcedureByCriteria.name,
        message: 'procedure.params.invalid'
      }))
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

    return resolve(sequelize.query(query, {type: sequelize.QueryTypes.SELECT}))
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
                       "transitiveClosure"."subtypeId" = description."conceptId" AND
                       unaccent(description."term") ILIKE '%${criteria}%' AND description.active = TRUE AND
                       description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM}
                 ORDER BY levenshtein('${req.query.criteria.trim()}', description.term) ASC
                 LIMIT 10
                 OFFSET 0;`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
