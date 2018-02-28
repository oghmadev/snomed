'use strict'

import * as utils from '../../components/utils'
import { Description, TransitiveClosure } from '../../sqldb'
import { APIParamMissingError } from '../../components/errors'
import constants from '../../components/constants'

export function getFindingsByCriteria (req, res) {
  return new Promise((resolve, reject) => {
    if (req.query.criteria == null) {
      return reject(new APIParamMissingError({
        missingParams: ['criteria'],
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getFindingsByCriteria.name,
        message: 'findings.criteria.missing'
      }))
    }

    const criteria = req.query.criteria.trim()

    return resolve(TransitiveClosure.findAll({
      where: {supertype: constants.SNOMED.HIERARCHY.FINDING},
      include: [{
        model: Description,
        where: {
          term: {$iLike: `'%${criteria}%'`},
          conceptId: {$col: 'TransitiveClosure.subtypeId'},
          active: true
        }
      }]
    }))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
