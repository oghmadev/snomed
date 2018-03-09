'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamInvalidError } from '../../components/errors'
import constants from '../../components/constants'

export function getParents (req, res) {
  return new Promise((resolve, reject) => {
    const invalidParams = []

    if (isNaN(req.query.skip)) invalidParams.push('skip')
    if (isNaN(req.query.limit)) invalidParams.push('limit')

    if (invalidParams.length > 0) {
      return reject(new APIParamInvalidError({
        invalidParams: invalidParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getParents.name,
        message: 'relationship.params.invalid'
      }))
    }

    const query = `SELECT
                     description.id,
                     description."conceptId",
                     description.term,
                     description."typeId"
                   FROM "TransitiveClosure" "transitiveClosure", "Description" description
                   WHERE "transitiveClosure"."subtypeId" = ${req.query.conceptId} AND description.active = TRUE AND
                         "transitiveClosure"."supertypeId" = description."conceptId"
                   OFFSET ${req.query.skip}
                   LIMIT ${req.query.limit};`

    return resolve(sequelize.query(query, {type: sequelize.QueryTypes.SELECT}))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getChildren (req, res) {
  return new Promise((resolve, reject) => {
    const invalidParams = []

    if (isNaN(req.query.skip)) invalidParams.push('skip')
    if (isNaN(req.query.limit)) invalidParams.push('limit')

    if (invalidParams.length > 0) {
      return reject(new APIParamInvalidError({
        invalidParams: invalidParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getChildren.name,
        message: 'relationship.params.invalid'
      }))
    }

    const query = `SELECT
                     description.id,
                     description."conceptId",
                     description.term,
                     description."typeId"
                   FROM "TransitiveClosure" "transitiveClosure", "Description" description
                   WHERE "transitiveClosure"."supertypeId" = ${req.query.conceptId} AND description.active = TRUE AND
                         "transitiveClosure"."subtypeId" = description."conceptId"
                   OFFSET ${req.query.skip}
                   LIMIT ${req.query.limit};`

    return resolve(sequelize.query(query, {type: sequelize.QueryTypes.SELECT}))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDirectParents (req, res) {
  const query = `SELECT
                   description.id,
                   description."conceptId",
                   description.term,
                   description."typeId"
                 FROM "Relationship" relationship, "Description" description
                 WHERE relationship."sourceId" = ${req.params.id} AND description.active = TRUE AND
                       relationship."destinationId" = description."conceptId" AND
                       relationship."typeId" = ${constants.SNOMED.TYPES.RELATIONSHIP.IS_A};`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDirectChildren (req, res) {
  const query = `SELECT
                   description.id,
                   description."conceptId",
                   description.term,
                   description."typeId"
                 FROM "Relationship" relationship, "Description" description
                 WHERE relationship."destinationId" = ${req.params.id} AND description.active = TRUE AND
                       relationship."sourceId" = description."conceptId" AND
                       relationship."typeId" = ${constants.SNOMED.TYPES.RELATIONSHIP.IS_A};`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
