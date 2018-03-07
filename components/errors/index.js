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

class FeatureUnavailableError extends BaseError {
  constructor (parent) {
    super(parent)

    this.feature = parent.feature
    this.name = 'SnomedFeatureUnavailableError'
    this.statusCode = 503

    Error.captureStackTrace(this, this.constructor)
  }
}

class FeatureFileError extends BaseError {
  constructor (parent) {
    super(parent)

    this.name = 'SnomedFeatureFileError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class FeatureFileMissingError extends FeatureFileError {
  constructor (parent) {
    super(parent)

    this.name = 'SnomedFeatureFileMissingError'
    this.statusCode = 404

    Error.captureStackTrace(this, this.constructor)
  }
}

class InvalidFeatureNameError extends FeatureFileError {
  constructor (parent) {
    super(parent)

    this.name = 'SnomedInvalidFeatureNameError'
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
