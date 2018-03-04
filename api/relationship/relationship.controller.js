'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function getParents (req, res) {
  return utils.checkToggle('relationship')
    .then(() => {
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
  return utils.checkToggle('relationship')
    .then(() => {
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

export function getDirectParents (req, res) {
  return utils.checkToggle('relationship')
    .then(() => {
      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getDirectParents.name,
          message: 'relationship.id.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Relationship" relationship, "Description" description
                     WHERE relationship."destinationId" = ${req.params.id} AND description.active = TRUE AND
                     relationship."sourceId" = description."conceptId" AND
                     relationship."typeId" = ${constants.SNOMED.TYPES.RELATIONSHIP.IS_A}
                     OFFSET ${req.query.skip}
                     LIMIT ${req.query.limit};`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDirectChildren (req, res) {
  return utils.checkToggle('relationship')
    .then(() => {
      if (req.params.id == null) {
        throw new APIParamMissingError({
          missingParams: ['id'],
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: getDirectChildren.name,
          message: 'relationship.id.missing'
        })
      }

      const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                     FROM "Relationship" relationship, "Description" description
                     WHERE relationship."sourceId" = ${req.params.id} AND description.active = TRUE AND
                     relationship."destinationId" = description."conceptId" AND
                     relationship."sourceId" = ${constants.SNOMED.TYPES.RELATIONSHIP.IS_A}
                     OFFSET ${req.query.skip}
                     LIMIT ${req.query.limit};`

      return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
