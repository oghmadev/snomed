'use strict'

import fs from 'fs'
import config from '../../config/environment'
import { FeatureFileError, FeatureFileMissingError, InvalidFeatureNameError } from '../../components/errors'

let features = {}

const FEATURES = ['auth', 'description', 'disorder', 'finding', 'procedure', 'relationship']
const FEATURES_PATH = `${config.dataPath}/features.toggles`

export function isFeatureToggled (featureName) {
  if (!FEATURES.includes(featureName)) {
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
    if (FEATURES.includes(featureName)) {
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

export function createFeaturesFile () {
  function createFile () {
    for (let feature of FEATURES) {
      features[feature] = true
    }

    return fs.writeFileSync(FEATURES_PATH, JSON.stringify(features))
  }

  if (fs.existsSync(FEATURES_PATH)) {
    const data = fs.readFileSync(FEATURES_PATH)
    let _features

    try {
      _features = JSON.parse(data)
    } catch (error) {
      fs.unlinkSync(FEATURES_PATH)

      return createFile()
    }

    for (let feature of FEATURES) {
      if (_features[feature] == null) return createFile()
    }
  }

  createFile()
}

export function sourceFile () {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(FEATURES_PATH)) return reject(new FeatureFileMissingError('featureFile.notFound'))

    return fs.readFile(FEATURES_PATH, (error, data) => error != null ? reject(new FeatureFileError('featureFile.error')) : resolve(data))
  })
    .then(data => {
      features = JSON.parse(data)

      return getFeatureStatus()
    })
}
