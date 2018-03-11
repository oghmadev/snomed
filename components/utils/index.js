'use strict'

import errorHandler from '../errorHandler'
import constants from '../constants'

export function respondWithResult (res, statusCode) {
  statusCode = statusCode || 200

  return entity => {
    if (entity != null) return res.status(statusCode).json(entity)

    return null
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

export function secondsToTime (seconds) {
  const hours = Math.floor(seconds / (60 * 60))
  const minutes = Math.floor(seconds % (60 * 60) / 60)

  seconds = Math.floor(seconds % 60)

  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function buildConceptStructure (concepts) {
  return concepts => {
    return concepts.filter(c => c.typeId === constants.SNOMED.TYPES.DESCRIPTION.FSN)
      .map(procedure => {
        procedure.synonyms = concepts.filter(c => c.typeId === constants.SNOMED.TYPES.DESCRIPTION.SYNONYM && c.conceptId === procedure.conceptId)

        return procedure
      })
  }
}
