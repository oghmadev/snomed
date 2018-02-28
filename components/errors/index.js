'use strict'

class BaseError extends Error {
  constructor (parent) {
    super(parent.message)

    this.name = 'SnomedBaseError'
    this.requestId = parent.requestId
    this.statusCode = 418

    Error.captureStackTrace(this, this.constructor)
  }
}

class EntityError extends BaseError {
  constructor (parent) {
    super(parent)

    this.entity = parent.entity
    this.name = 'SnomedEntityError'
    this.statusCode = 500

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIError extends BaseError {
  constructor (parent) {
    super(parent)

    this.method = parent.method
    this.endpoint = parent.endpoint
    this.controllerFunction = parent.controllerFunction
    this.name = 'SnomedAPIError'
    this.statusCode = 400

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIParamMissingError extends APIError {
  constructor (parent) {
    super(parent)

    this.missingParams = parent.missingParams || []
    this.name = 'SnomedAPIParamMissingError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIParamInvalidError extends APIError {
  constructor (parent) {
    super(parent)

    this.invalidParams = parent.invalidParams || []
    this.name = 'SnomedAPIParamInvalidError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class AuthenticationError extends BaseError {
  constructor (parent) {
    super(parent)

    this.name = 'SnomedAuthenticationError'
    this.statusCode = 401
  }
}

class UserNotFoundError extends AuthenticationError {
  constructor (parent) {
    super(parent)

    this.name = 'SnomedUserNotFoundError'
    this.statusCode = 404
  }
}

class UserInactiveError extends AuthenticationError {
  constructor (parent) {
    super(parent)

    this.name = 'SnomedUserInactiveFoundError'
    this.statusCode = 403
  }
}

module.exports = {
  BaseError,
  APIError,
  APIParamMissingError,
  APIParamInvalidError,
  EntityError,
  AuthenticationError,
  UserNotFoundError,
  UserInactiveError
}
