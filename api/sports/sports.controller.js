'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function getSportsByCriteria (req, res) {
  return utils.checkToggle('sports')
    .then(() => {
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getSportsByCriteria.name,
          message: 'sports.params.missing'
        })
      }

      const criteria = req.query.criteria.trim()
        .split(/\s/)
        .join('%')

      const query = `WITH temp AS (SELECT DISTINCT description."conceptId",
                                     (levenshtein('${req.query.criteria.trim()}', description.term)) AS distance
                                   FROM "TransitiveClosure" "transitiveClosure", "Description" description
                                   WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.SPORTS} AND
                                         description.active = TRUE AND
                                          "transitiveClosure"."subtypeId" = description."conceptId" AND
                                         unaccent(description."term") ILIKE '%${criteria}%' 
                                   ORDER BY distance ASC
                                   LIMIT 10
                                   OFFSET 0)
                     SELECT
                       description.id,
                       description."conceptId",
                       description.term,
                       description."typeId"
                     FROM "Description" description, temp
                     WHERE description."conceptId" = temp."conceptId" AND
                           levenshtein('${req.query.criteria.trim()}', description.term) = (SELECT MIN(levenshtein('${req.query.criteria.trim()}', term))
                                                                                            FROM "Description"
                                                                                            WHERE "conceptId" = temp."conceptId");`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
