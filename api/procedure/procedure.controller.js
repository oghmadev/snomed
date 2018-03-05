'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
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

      const query = `SELECT COUNT(*)
                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                     WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PROCEDURE} AND 
                           description.active = TRUE AND "transitiveClosure"."subtypeId" = description."conceptId" AND 
                           unaccent(description."term") ILIKE '%${criteria}%' AND 
                           description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN};`

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
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getProcedureByCriteria.name,
          message: 'procedure.criteria.missing'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `WITH FSN AS (SELECT description."conceptId"
                                  FROM "TransitiveClosure" "transitiveClosure", "Description" description
                                  WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PROCEDURE} AND 
                                        description.active = TRUE AND
                                        "transitiveClosure"."subtypeId" = description."conceptId" AND 
                                        unaccent(description."term") ILIKE '%${criteria}%' AND 
                                        description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN}
                                  LIMIT 10
                                  OFFSET 0)
                     SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description, FSN
                     WHERE description."conceptId" = FSN."conceptId";`

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
