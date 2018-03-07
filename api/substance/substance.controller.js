'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function getSubstanceByCriteria (req, res) {
  return utils.checkToggle('substance')
    .then(() => {
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getSubstanceByCriteria.name,
          message: 'substance.criteria.missing'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                     WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.SUBSTANCE} AND 
                           description.active = TRUE AND "transitiveClosure"."subtypeId" = description."conceptId" AND 
                           (unaccent(description."term") ILIKE '${criteria}' OR unaccent(description."term") ILIKE '%${criteria}%') AND 
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
