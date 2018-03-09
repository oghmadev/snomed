'use strict'

import fs from 'fs'
import config from '../../config/environment'
import { FeatureFileError, FeatureFileMissingError, InvalidFeatureNameError } from '../../components/errors'

let features = {}
let FEATURES = []
const FEATURES_PATH = `${config.dataPath}/features.json`

export function getFeatureNames () {
  return FEATURES
}

export function isFeatureToggled (featureName) {
  if (!features.hasOwnProperty(featureName)) {
    throw new InvalidFeatureNameError({
      featureName: featureName,
      message: `${featureName}.invalidName`
    })
  }

  return features[featureName]
}

export function getFeatureStatus (featureName) {
  const out = {}

  if (featureName != null) {
    if (features.hasOwnProperty(featureName)) {
      out[featureName] = features[featureName] ? 'UP' : 'DOWN'

      return out
    }

    throw new InvalidFeatureNameError({
      featureName: featureName,
      message: `${featureName}.invalidName`
    })
  }

  for (let featureName of FEATURES) {
    out[featureName] = features[featureName] ? 'UP' : 'DOWN'
  }

  return out
}

export function sourceFile () {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(FEATURES_PATH)) return reject(new FeatureFileMissingError('featureFile.notFound'))

    return fs.readFile(FEATURES_PATH, (error, data) => error != null ? reject(new FeatureFileError('featureFile.error')) : resolve(data))
  })
    .then(data => {
      let featuresJSON = JSON.parse(data)
      FEATURES = []

      for (let property in featuresJSON) {
        if (featuresJSON.hasOwnProperty(property)) {
          FEATURES.push(property)
          features[property] = featuresJSON[property].value
        }
      }

      return getFeatureStatus()
    })
}
