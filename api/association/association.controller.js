'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'

export function getParents (req, res) {
  return new Promise((resolve, reject) => {
    const missingParams = []

    if (req.query.skip == null) missingParams.push('skip')
    if (req.query.limit == null) missingParams.push('limit')
    if (req.query.conceptId == null) missingParams.push('conceptId')

    if (missingParams.length > 0) {
      return reject(new APIParamMissingError({
        missingParams: missingParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getParents.name,
        message: 'association.params.missing'
      }))
    }

    const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                   FROM "TransitiveClosure" "trasitiveClosure", "Description" description
                   WHERE "trasitiveClosure"."subtypeId" = ${req.query.conceptId} AND description.active = TRUE AND
                   "trasitiveClosure"."supertypeId" = description."conceptId"
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
    const missingParams = []

    if (req.query.skip == null) missingParams.push('skip')
    if (req.query.limit == null) missingParams.push('limit')
    if (req.query.conceptId == null) missingParams.push('conceptId')

    if (missingParams.length > 0) {
      return reject(new APIParamMissingError({
        missingParams: missingParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getChildren.name,
        message: 'association.params.missing'
      }))
    }

    const query = `SELECT description.id, description."conceptId", description.term, description."typeId"
                   FROM "TransitiveClosure" "trasitiveClosure", "Description" description
                   WHERE "trasitiveClosure"."supertypeId" = ${req.query.conceptId} AND description.active = TRUE AND
                   "trasitiveClosure"."subtypeId" = description."conceptId"
                   OFFSET ${req.query.skip}
                   LIMIT ${req.query.limit};`

    return resolve(sequelize.query(query, {type: sequelize.QueryTypes.SELECT}))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
