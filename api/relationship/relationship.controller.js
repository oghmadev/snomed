'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError,FeatureUnavailableError } from '../../components/errors'
import { isFeatureToggled } from '../../components/featureToggles'

export function getParents (req, res) {
  return Promise.resolve(isFeatureToggled('relationship'))
    .then(isToggled => {
      if (!isToggled) {
        throw new FeatureUnavailableError({
          feature: 'relationship',
          message: 'relationship.feature.inactive'
        })
      }

      const missingParams = []

      if (req.query.skip == null) missingParams.push('skip')
      if (req.query.limit == null) missingParams.push('limit')
      if (req.query.conceptId == null) missingParams.push('conceptId')

      if (missingParams.length > 0) {
        throw new APIParamMissingError({
          missingParams: missingParams,
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getParents.name,
          message: 'relationship.params.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                     WHERE "transitiveClosure"."subtypeId" = ${req.query.conceptId} AND description.active = TRUE AND
                     "transitiveClosure"."supertypeId" = description."conceptId"
                     OFFSET ${req.query.skip}
                     LIMIT ${req.query.limit};`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getChildren (req, res) {
  return Promise.resolve(isFeatureToggled('relationship'))
    .then(isToggled => {
      if (!isToggled) {
        throw new FeatureUnavailableError({
          feature: 'relationship',
          message: 'relationship.feature.inactive'
        })
      }

      const missingParams = []

      if (req.query.skip == null) missingParams.push('skip')
      if (req.query.limit == null) missingParams.push('limit')
      if (req.query.conceptId == null) missingParams.push('conceptId')

      if (missingParams.length > 0) {
        throw new APIParamMissingError({
          missingParams: missingParams,
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getChildren.name,
          message: 'relationship.params.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "TransitiveClosure" "transitiveClosure", "Description" description
                     WHERE "transitiveClosure"."supertypeId" = ${req.query.conceptId} AND description.active = TRUE AND
                     "transitiveClosure"."subtypeId" = description."conceptId"
                     OFFSET ${req.query.skip}
                     LIMIT ${req.query.limit};`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
