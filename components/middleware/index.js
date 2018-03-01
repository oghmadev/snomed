'use strict'

import logger from '../../config/logs'
import jwt from 'jsonwebtoken'
import compose from 'composable-middleware'
import { User } from '../../sqldb'

export function isAuthenticated () {
  return compose()
    .use((req, res, next) => {
      if (req.get('API-Key') == null) return res.status(403).send('Forbidden')

      User.find({
        where: {id: req.user.id},
        attributes: ['id', 'username']
      })
        .then(user => {
          if (user == null) return res.status(401).end()

          const verification = jwt.verify(req.get('API-Key', 'snomed-secret-asd'))

          if (verification.id !== user.id || verification.username !== user.username) return res.status(403).send('Forbidden')

          req.user = user
          next()

          return null
        })
        .catch(err => next(err))
    })
    .use(hasRequestId())
}

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
}

export function logRequest (controllerName, functionName) {
  return (req, res, next) => {
    logger.snomed.server.info(`${req.get('X-Request-ID')},${controllerName}.${functionName},${req.user != null ? req.user.id : 'null'}`)

    return next()
  }
}
