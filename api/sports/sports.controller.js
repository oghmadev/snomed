'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import constants from '../../components/constants'

export function getSportsByCriteria (req, res) {
  const criteria = req.query.criteria.trim()
    .split(/\s/)
    .join('%')

  const query = `WITH temp AS (SELECT
                                 DISTINCT description."conceptId",
                                 (levenshtein('${req.query.criteria.trim()}', description.term)) AS distance
                               FROM "TransitiveClosure" "transitiveClosure", "Description" description
                               WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.SPORTS} AND
                                      "transitiveClosure"."subtypeId" = description."conceptId" AND
                                     unaccent(description."term") ILIKE '%${criteria}%' AND description.active = TRUE
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
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
