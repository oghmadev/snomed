'use strict'

import logger from '../../config/logs'
import expressJwt from 'express-jwt'
import compose from 'composable-middleware'
import { User } from '../../sqldb'
import config from '../../config/environment'

const validateJwt = expressJwt({secret: config.secrets.session})

export function isAuthenticated () {
  return compose()
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) req.headers.authorization = `Bearer ${req.query.access_token}`

      // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
      if (req.query && typeof req.headers.authorization === 'undefined') req.headers.authorization = `Bearer ${req.cookies.token}`

      validateJwt(req, res, next)
    })
    .use((req, res, next) => {
      User.find({where: {id: req.user.id}})
        .then(user => {
          if (user == null) return res.status(403).send('Forbidden')

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
