'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError, FeatureUnavailableError } from '../../components/errors'
import constants from '../../components/constants'
import { isFeatureToggled } from '../../components/featureToggles'

export function getDisorderByCriteria (req, res) {
  return Promise.resolve(isFeatureToggled('disorder'))
    .then(isToggled => {
      if (!isToggled) {
        throw new FeatureUnavailableError({
          feature: 'disorder',
          message: 'disorder.feature.inactive'
        })
      }

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
                                  WHERE "transitiveClosure"."supertypeId" = ${constants.SNOMED.HIERARCHY.FINDING.DISORDER.id} AND 
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
    .then(disorders => {
      const out = disorders.filter(d => d.typeId === constants.SNOMED.TYPES.DESCRIPTION.FSN.id)

      return out.map(disorder => {
        disorder.synonyms = disorders.filter(d => d.typeId === constants.SNOMED.TYPES.DESCRIPTION.SYNONYM.id && d.conceptId === disorder.conceptId)

        return disorder
      })
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
