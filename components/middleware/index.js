'use strict'

import config from '../../config/environment'
import logger from '../../config/logs'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import compose from 'composable-middleware'
import { Location, Name, User } from '../../sqldb'

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
      User.find({
        where: {id: req.user.id},
        include: [Name]
      })
        .then(user => {
          if (user == null) return res.status(401).end()

          req.user = user
          next()

          return null
        })
        .catch(err => next(err))
    })
    .use(hasRequestId())
}

export function findLocation () {
  return compose()
    .use((req, res, next) => {
      Location.findById(req.body.locationId, {attributes: ['id', 'name']})
        .then(location => {
          if (location != null) req.location = location

          next()

          return null
        })
        .catch(err => next(err))
    })
}

export function hasRole (rolesRequired) {
  if (rolesRequired == null || !Array.isArray(rolesRequired)) throw new Error('Required role needs to be set')

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (rolesRequired.includes(req.user.role)) next()
      else res.status(403).send('Forbidden')
    })
}

export function signToken (id, role) {
  return jwt.sign({id: id, role: role}, config.secrets.session, {expiresIn: 60 * 60 * 5})
}

export function setTokenCookie (req, res) {
  if (req.user == null) return res.status(404).send(`It looks like you aren't logged in, please try again.`)

  const token = signToken(req.user.id, req.user.role)
  res.cookie('token', token)
  res.redirect('/')
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
