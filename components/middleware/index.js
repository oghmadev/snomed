'use strict'

import logger from '../../config/logs'
import compose from 'composable-middleware'
import jwt from 'jsonwebtoken'
import LOCAL_ENV from '../../config/local.env'
import { APIParamMissingError, FeatureUnavailableError } from '../errors'
import { isFeatureToggled } from '../featureToggles'
import errorHandler from '../errorHandler'

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
        const decodedKey = jwt.verify(token, LOCAL_ENV.API_PASSPHRASE)

        if (LOCAL_ENV.verification.iat === decodedKey.iat && LOCAL_ENV.verification.user === decodedKey.user) return next()

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

export function checkToggle (featureName) {
  return compose()
    .use((req, res, next) => {
      if (!isFeatureToggled(featureName)) {
        const error = new FeatureUnavailableError({
          feature: featureName,
          message: `${featureName}.feature.inactive`
        })

        errorHandler(error)

        return res.status(503).send('Service Unavailable')
      }

      return next()
    })
    .use(hasRequestId())
}

export function validateParams (params, featureName, functionName) {
  return compose()
    .use(checkToggle(featureName))
    .use((req, res, next) => {
      const missingParams = params.filter(param => req[param.source][param.name] == null).map(param => param.name)

      if (missingParams.length > 0) {
        const error = new APIParamMissingError({
          missingParams: missingParams,
          endpoint: req.originalUrl,
          method: req.method,
          controllerFunction: functionName,
          message: `${featureName}.params.missing`
        })

        errorHandler(error)

        return res.status(422).send(error.message)
      }

      return next()
    })
    .use(logRequest(featureName, functionName))
}
