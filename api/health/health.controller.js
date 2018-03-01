'use strict'

import * as utils from '../../components/utils'
import * as featureToggles from '../../components/featureToggles'

function formatTime (seconds) {
  const hours = Math.floor(seconds / (60 * 60))
  const minutes = Math.floor(seconds % (60 * 60) / 60)

  seconds = Math.floor(seconds % 60)

  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function getHealth (req, res) {
  const health = {
    featureStatus: {
      auth: featureToggles.isAuthToggled() ? 'UP' : 'DOWN',
      finding: featureToggles.isFindingToggled() ? 'UP' : 'DOWN',
      description: featureToggles.isDescriptionToggled() ? 'UP' : 'DOWN',
      relationship: featureToggles.isRelationshipToggled() ? 'UP' : 'DOWN'
    },
    uptime: formatTime(process.uptime())
  }

  return Promise.resolve(health)
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
