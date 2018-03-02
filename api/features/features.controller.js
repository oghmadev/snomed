'use strict'

import * as utils from '../../components/utils'
import { sourceFile } from '../../components/featureToggles'

export function source (req, res) {
  return sourceFile()
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}
