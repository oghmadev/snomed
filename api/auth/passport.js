'use strict'

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

function localAuthenticate (User, username, password, done) {
  User.find({where: {username: username.toLowerCase()}})
    .then(user => {
      if (user == null) return done({message: 'user.username.doesNotExist'})

      return user.authenticate(password, user.salt, user.password)
        .then(isAuthenticated => isAuthenticated ? done(null, user) : done({message: 'user.password.incorrect'}))
        .catch(err => done(err))
    })
    .catch(err => done(err))
}

export function setup (User) {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => localAuthenticate(User, username, password, done)))
}
