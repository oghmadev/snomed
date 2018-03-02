'use strict'

import * as utils from '../../components/utils'
import * as featureToggles from '../../components/featureToggles'

export function getHealth (req, res) {
  const health = {
    featureStatus: featureToggles.getFeatureStatus(),
    uptime: utils.secondsToTime(process.uptime())
  }

  return Promise.resolve(health)
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
