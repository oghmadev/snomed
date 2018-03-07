'use strict'

import logger from '../../config/logs'
import compose from 'composable-middleware'
import jwt from 'jsonwebtoken'
import LOCAL_ENV from '../../config/local.env'

export function hasRequestId () {
  return compose()
    .use((req, res, next) => {
      if (req.get('X-Request-ID') == null) {
        return res.status(403).send('Forbidden')
      } else {
        req.requestId = req.get('X-Request-ID')
        return next()
      }
    })
    .use(verifyAPIKEY())
}

export function verifyAPIKEY () {
  return compose()
    .use((req, res, next) => {
      if (req.get('X-API-Key') == null) {
        return res.status(403).send('Forbidden')
      } else {
        const token = req.get('X-API-KEY')
        const verificationObject = jwt.verify(token, LOCAL_ENV.API_PASSPHRASE)

        if (LOCAL_ENV.verification.iat === verificationObject.iat && LOCAL_ENV.verification.user === verificationObject.user) return next()

        return res.status(403).send('Forbidden')
      }
    })
}

export function logRequest (controllerName, functionName) {
  return (req, res, next) => {
    logger.snomed.server.info(`${req.get('X-Request-ID')},${controllerName}.${functionName},${req.user != null ? req.user.id : 'null'}`)

    return next()
  }
}
