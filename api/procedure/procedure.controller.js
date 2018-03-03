'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError, FeatureUnavailableError } from '../../components/errors'
import constants from '../../components/constants'
import { isFeatureToggled } from '../../components/featureToggles'

export function getProcedureByCriteria (req, res) {
  return Promise.resolve(isFeatureToggled('procedure'))
    .then(isToggled => {
      if (!isToggled) {
        throw new FeatureUnavailableError({
          feature: 'procedure',
          message: 'procedure.feature.inactive'
        })
      }

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
                                  WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.PROCEDURE.id} AND 
                                        description.active = TRUE AND
                                        "transitiveClosure"."subtypeId" = description."conceptId" AND 
                                        unaccent(description."term") ILIKE '%${criteria}%' AND 
                                        description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN.id}
                                  LIMIT 10
                                  OFFSET 0)
                     SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description, FSN
                     WHERE description."conceptId" = FSN."conceptId";`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(procedures => {
      const out = procedures.filter(p => p.typeId === constants.SNOMED.TYPES.DESCRIPTION.FSN.id)

      return out.map(procedure => {
        procedure.synonyms = procedures.filter(p => p.typeId === constants.SNOMED.TYPES.DESCRIPTION.SYNONYM.id && p.conceptId === procedure.conceptId)

        return procedure
      })
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}