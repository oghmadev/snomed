'use strict'

class BaseError extends Error {
  constructor (parent) {
    super(parent.message)

    this.name = 'SNOMEDBaseError'
    this.requestId = parent.requestId
    this.statusCode = 418

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIError extends BaseError {
  constructor (parent) {
    super(parent)

    this.method = parent.method
    this.endpoint = parent.endpoint
    this.controllerFunction = parent.controllerFunction
    this.name = 'SNOMEDAPIError'
    this.statusCode = 400

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIParamMissingError extends APIError {
  constructor (parent) {
    super(parent)

    this.missingParams = parent.missingParams || []
    this.name = 'SNOMEDAPIParamMissingError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIParamInvalidError extends APIError {
  constructor (parent) {
    super(parent)

    this.invalidParams = parent.invalidParams || []
    this.name = 'SNOMEDAPIParamInvalidError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class FeatureUnavailableError extends BaseError {
  constructor (parent) {
    super(parent)

    this.feature = parent.feature
    this.name = 'SNOMEDFeatureUnavailableError'
    this.statusCode = 503

    Error.captureStackTrace(this, this.constructor)
  }
}

class FeatureFileError extends BaseError {
  constructor (parent) {
    super(parent)

    this.name = 'SNOMEDFeatureFileError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class FeatureFileMissingError extends FeatureFileError {
  constructor (parent) {
    super(parent)

    this.name = 'SNOMEDFeatureFileMissingError'
    this.statusCode = 404

    Error.captureStackTrace(this, this.constructor)
  }
}

class InvalidFeatureNameError extends FeatureFileError {
  constructor (parent) {
    super(parent)

    this.name = 'SNOMEDInvalidFeatureNameError'
    this.featureName = parent.featureName

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  BaseError,
  APIError,
  APIParamMissingError,
  APIParamInvalidError,
  FeatureUnavailableError,
  FeatureFileError,
  FeatureFileMissingError,
  InvalidFeatureNameError
}
