'use strict'

import jwt from 'jsonwebtoken'
import passport from 'passport'
import * as utils from '../../components/utils'
import { AuthenticationError, UserInactiveError, UserNotFoundError } from '../../components/errors'
import config from '../../config/environment'

export function authenticate (req, res) {
  return utils.checkToggle('auth')
    .then(() => {
      return new Promise((resolve, reject) => {
        return passport.authenticate('local', (error, user) => {
          if (error != null) return reject(new AuthenticationError({message: error.message}))
          if (user == null) return reject(new UserNotFoundError({message: 'authenticate.user.notFound'}))
          if (!user.active) return reject(new UserInactiveError({message: 'authenticate.inactiveUser'}))

          return resolve(res.json({token: jwt.sign({id: user.id, username: user.username}, config.secrets.session)}))
        })(req, res)
      })
    })
    .catch(utils.handleError(res, req.requestId))
}
