'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import constants from '../../components/constants'

export function getSpecialtyByCriteria (req, res) {
  const criteria = req.query.criteria.trim()
    .split(/\s/)
    .join('%')

  const query = `SELECT 
                   description.id, 
                   description."conceptId", 
                   description.term, 
                   description."typeId"
                 FROM "TransitiveClosure" "transitiveClosure", "Description" description
                 WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PRACTITIONER} AND 
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
