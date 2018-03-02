'use strict'

import * as utils from '../../components/utils'
import { getFeatureStatus } from '../../components/featureToggles'

export function getHealth (req, res) {
  const health = {
    featureStatus: getFeatureStatus(),
    uptime: utils.secondsToTime(process.uptime())
  }

  return Promise.resolve(health)
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
