'use strict'

import errorHandler from '../errorHandler'
import featureToggles from '../featureToggles'
import { FeatureUnavailableError } from '../errors'

export function respondWithResult (res, statusCode) {
  statusCode = statusCode || 200

  return entity => {
    if (entity != null) return res.status(statusCode).json(entity)

    return null
  }
}

export function respondWithStatus (response, statusCode, message) {
  statusCode = statusCode || 200

  return () => {
    const statusObject = {
      message: message,
      loaded: true
    }

    return response.status(statusCode).json(statusObject)
  }
}

export function checkToggle (toggleName) {
  if (!featureToggles[`is${toggleName}Toggled`]()) {
    return new FeatureUnavailableError({
      feature: toggleName,
      message: `${toggleName}.feature.inactive`
    })
  }
}

export function handleEntityNotFound (res) {
  return entity => {
    if (entity == null) {
      res.status(404).end()

      return null
    }

    return entity
  }
}

export function handleError (res, requestId, statusCode = 500) {
  return error => {
    error.requestId = requestId
    statusCode = error.statusCode || statusCode

    return errorHandler(error)
      .then(err => {
        err.requestId = requestId
        res.status(statusCode).send(err)
      })
  }
}

// Does not work for objects with circular references
export function deepClone (source) {
  return JSON.parse(JSON.stringify(source))
}

export function removeDuplicates (keyFn, array) {
  const mySet = new Set()

  return array.filter(x => {
    const key = keyFn(x)
    const isNew = !mySet.has(key)

    if (isNew) mySet.add(key)

    return isNew
  })
}

export function sortById (a, b) {
  return a.id - b.id
}

export function resolveCallback (resolve, reject) {
  return (err, data) => {
    if (err != null) return reject(err)

    return resolve(data)
  }
}
