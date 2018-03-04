'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function getDisorderByCriteria (req, res) {
  return utils.checkToggle('disorder')
    .then(() => {
      if (req.query.criteria == null) {
        throw new APIParamMissingError({
          missingParams: ['criteria'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getDisorderByCriteria.name,
          message: 'disorder.criteria.missing'
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
                                  LIMIT 10
                                  OFFSET 0)
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
