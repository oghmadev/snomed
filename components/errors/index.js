'use strict'

class BaseError extends Error {
  constructor (parent) {
    super(parent.message)

    this.name = 'SironaBaseError'
    this.requestId = parent.requestId
    this.statusCode = 418

    Error.captureStackTrace(this, this.constructor)
  }
}

class EntityError extends BaseError {
  constructor (parent) {
    super(parent)

    this.entity = parent.entity
    this.name = 'SironaEntityError'
    this.statusCode = 500

    Error.captureStackTrace(this, this.constructor)
  }
}

class PatientNotUniqueError extends EntityError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaPatientNotUniqueError'
    this.birthDate = parent.birthDate
    this.given = parent.given
    this.family = parent.family
    this.dni = parent.dni
    this.id = parent.id

    Error.captureStackTrace(this, this.constructor)
  }
}

class PractitionerNotUniqueError extends EntityError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaPractitionerNotUniqueError'
    this.birthDate = parent.birthDate
    this.given = parent.given
    this.family = parent.family
    this.dni = parent.dni
    this.id = parent.id

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIError extends BaseError {
  constructor (parent) {
    super(parent)

    this.method = parent.method
    this.endpoint = parent.endpoint
    this.controllerFunction = parent.controllerFunction
    this.name = 'SironaAPIError'
    this.statusCode = 400

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIParamMissingError extends APIError {
  constructor (parent) {
    super(parent)

    this.missingParams = parent.missingParams || []
    this.name = 'SironaAPIParamMissingError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class APIParamInvalidError extends APIError {
  constructor (parent) {
    super(parent)

    this.invalidParams = parent.invalidParams || []
    this.name = 'SironaAPIParamInvalidError'

    Error.captureStackTrace(this, this.constructor)
  }
}

class FileError extends BaseError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaFileError'
    this.originalError = parent.originalError
    this.statusCode = 500

    Error.captureStackTrace(this, this.constructor)
  }
}

class FileExtensionError extends FileError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaFileExtensionError'
    this.extension = parent.extension

    Error.captureStackTrace(this, this.constructor)
  }
}

class FileTypeError extends FileError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaFileTypeError'
    this.type = parent.type

    Error.captureStackTrace(this, this.constructor)
  }
}

class FileNotFoundError extends FileError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaFileNotFoundError'
    this.statusCode = 404

    if (parent.path != null) this.path = parent.path

    Error.captureStackTrace(this, this.constructor)
  }
}

class GoogleMapsError extends BaseError {
  constructor (parent) {
    super(parent)

    this.latitude = parent.latitude
    this.longitude = parent.longitude
    this.originalError = parent.originalError
    this.name = 'GoogleMapsError'
    this.statusCode = 500

    Error.captureStackTrace(this, this.constructor)
  }
}

class AuthenticationError extends BaseError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaAuthenticationError'
    this.statusCode = 401
  }
}

class UserNotFoundError extends AuthenticationError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaUserNotFoundError'
    this.statusCode = 404
  }
}

class UserInactiveError extends AuthenticationError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaUserInactiveFoundError'
    this.statusCode = 403
  }
}

class LocationNotFoundError extends AuthenticationError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaLocationNotFoundError'
    this.statusCode = 404
    this.email = parent.email
    this.locationId = parent.locationId
  }
}

class TurnError extends BaseError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaTurnError'
    this.statusCode = 500
  }
}

class NoTurnsForLocationError extends BaseError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaNoTurnsForLocationError'
    this.statusCode = 404
  }
}

class AppointmentError extends TurnError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaAppointmentError'
  }
}

class QueueSlotError extends TurnError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaQueueSlotError'
  }
}

class InsuranceNotUniqueError extends EntityError {
  constructor (parent) {
    super(parent)

    this.name = 'SironaInsuranceNotUniqueError'

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  BaseError,
  APIError,
  APIParamMissingError,
  APIParamInvalidError,
  FileError,
  FileExtensionError,
  FileTypeError,
  FileNotFoundError,
  EntityError,
  PatientNotUniqueError,
  PractitionerNotUniqueError,
  GoogleMapsError,
  AuthenticationError,
  UserNotFoundError,
  UserInactiveError,
  LocationNotFoundError,
  TurnError,
  NoTurnsForLocationError,
  AppointmentError,
  QueueSlotError,
  InsuranceNotUniqueError
}
