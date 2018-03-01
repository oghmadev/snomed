'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function getFindingsByCriteria (req, res) {
  return new Promise((resolve, reject) => {
    if (req.query.criteria == null) {
      return reject(new APIParamMissingError({
        missingParams: ['criteria'],
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getFindingsByCriteria.name,
        message: 'findings.criteria.missing'
      }))
    }

    const criteria = req.query.criteria.trim()
      .split(/\s/)
      .join('%')

    const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                   FROM "TransitiveClosure" "transitiveClosure", "Description" description
                   WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.FINDING} AND 
                         description.active = TRUE AND "transitiveClosure"."subtypeId" = description."conceptId" AND 
                         unaccent(description."term") ILIKE '%${criteria}%' AND 
                         description."typeId" <> ${constants.SNOMED.TYPES.DESCRIPTION.FSN}
                   LIMIT 10
                   OFFSET 0;`

    return resolve(sequelize.query(query, {type: sequelize.QueryTypes.SELECT}))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
