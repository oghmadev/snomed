'use strict'

import * as utils from '../../components/utils'
import { sequelize } from '../../sqldb'
import constants from '../../components/constants'

export function getFSN (req, res) {
  const query = `SELECT
                   description.id,
                   description."conceptId",
                   description.term,
                   description."typeId"
                 FROM "Description" description
                 WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE AND
                       description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.FSN};`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(results => results.length > 1 ? results : results[0])
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getSynonyms (req, res) {
  const query = `SELECT
                   description.id,
                   description."conceptId",
                   description.term,
                   description."typeId"
                 FROM "Description" description
                 WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE AND
                       description."typeId" = ${constants.SNOMED.TYPES.DESCRIPTION.SYNONYM};`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getComplete (req, res) {
  const query = `SELECT
                   description.id,
                   description."conceptId",
                   description.term,
                   description."typeId"
                 FROM "Description" description
                 WHERE description."conceptId" = ${req.params.id} AND description.active = TRUE;`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(concepts => utils.buildConceptStructure(concepts)[0])
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getDescription (req, res) {
  const query = `SELECT
                   description.id,
                   description."conceptId",
                   description.term,
                   description."typeId"
                 FROM "Description" description
                 WHERE description."id" = ${req.params.id} AND description.active = TRUE;`

  return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(results => results.length > 1 ? results : results[0])
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
