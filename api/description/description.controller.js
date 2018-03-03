'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError, FeatureUnavailableError } from '../../components/errors'
import constants from '../../components/constants'
import { isFeatureToggled } from '../../components/featureToggles'

export function getFSN (req, res) {
  return Promise.resolve(isFeatureToggled('description'))
    .then(isToggled => {
      if (!isToggled) {
        throw new FeatureUnavailableError({
          feature: 'description',
          message: 'description.feature.inactive'
        })
      }

      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getFSN.name,
          message: 'description.conceptId.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description
                     WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE AND
                     description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN.id}`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getSynonyms (req, res) {
  return Promise.resolve(isFeatureToggled('description'))
    .then(isToggled => {
      if (!isToggled) {
        throw new FeatureUnavailableError({
          feature: 'description',
          message: 'description.feature.inactive'
        })
      }

      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getFSN.name,
          message: 'description.conceptId.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Description" description
                     WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE AND
                     description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM.id}`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
