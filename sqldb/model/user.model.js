'use strict'

import crypto from 'crypto'

export default function (sequelize, DataTypes) {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: {msg: 'user.username.notUnique'}
    },
    password: {
      type: DataTypes.STRING,
      validate: {notEmpty: true}
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    salt: DataTypes.STRING
  }, {
    tableName: 'User',
    getterMethods: {
      token () {
        return {
          id: this.id,
          role: this.role
        }
      }
    },
    hooks: {
      beforeCreate (user) {
        return updatePassword(user, sequelize)
      }
    }
  })

  user.prototype.authenticate = (password, salt, hashedPassword) => {
    return encryptPassword(password, salt)
      .then(generatedPassword => hashedPassword === generatedPassword)
  }

  return user
}

function updatePassword (user, sequelize) {
  if (user.password == null) return sequelize.Promise.resolve(null)
  if (user.password.length < 1) return sequelize.Promise.reject(new Error('Invalid password'))

  return makeSalt()
    .then(salt => {
      user.salt = salt

      return encryptPassword(user.password, salt)
    })
    .then(hashedPassword => (user.password = hashedPassword))
    .catch(err => sequelize.Promise.reject(err))
}

function makeSalt () {
  return new Promise((resolve, reject) => crypto.randomBytes(16, (err, salt) => err != null ? reject(err) : resolve(salt.toString('base64'))))
}

function encryptPassword (password, salt) {
  const DEFAULT_ITERATIONS = 10000
  const DEFAULT_KEY_LENGTH = 64
  const DIGEST = 'sha1'
  const SALT = Buffer.from(salt, 'base64')

  return new Promise((resolve, reject) => crypto.pbkdf2(password, SALT, DEFAULT_ITERATIONS, DEFAULT_KEY_LENGTH, DIGEST, (err, key) => err != null ? reject(err) : resolve(key.toString('base64'))))
}
