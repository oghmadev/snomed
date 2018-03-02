'use strict'

let _isAuthToggled = true
let _isDescriptionToggled = true
let _isFindingToggled = true
let _isRelationshipToggled = true

export function toggleAuthFeature (value) {
  if (typeof value === 'boolean') _isAuthToggled = value
}

export function isAuthToggled () {
  return _isAuthToggled
}

export function toggleDescriptionFeature (value) {
  if (typeof value === 'boolean') _isDescriptionToggled = value
}

export function isDescriptionToggled () {
  return _isDescriptionToggled
}

export function toggleFindingFeature (value) {
  if (typeof value === 'boolean') _isFindingToggled = value
}

export function isFindingToggled () {
  return _isFindingToggled
}

export function toggleRelationshipFeature (value) {
  if (typeof value === 'boolean') _isRelationshipToggled = value
}

export function isRelationshipToggled () {
  return _isRelationshipToggled
}

export function getFeatureStatus (featureName) {
  if (featureName != null) {
    switch (featureName) {
      case 'auth':
        return {auth: isAuthToggled() ? 'UP' : 'DOWN'}

      case 'description':
        return {description: isAuthToggled() ? 'UP' : 'DOWN'}

      case 'finding':
        return {finding: isAuthToggled() ? 'UP' : 'DOWN'}

      case 'relationship':
        return {relationship: isAuthToggled() ? 'UP' : 'DOWN'}

      default:
        return {error: `${featureName} is not a valid feature name.`}
    }
  }

  return {
    auth: isAuthToggled() ? 'UP' : 'DOWN',
    finding: isFindingToggled() ? 'UP' : 'DOWN',
    description: isDescriptionToggled() ? 'UP' : 'DOWN',
    relationship: isRelationshipToggled() ? 'UP' : 'DOWN'
  }
}

export function toggleFeature (featureName, value) {
  if (featureName == null || value == null) return {error: 'featureName and value are required.'}
  if (typeof value !== 'boolean') return {error: `${value} is not a valid value.`}

  switch (featureName) {
    case 'auth':
      return toggleAuthFeature(value)

    case 'description':
      return toggleDescriptionFeature(value)

    case 'finding':
      return toggleFindingFeature(value)

    case 'relationship':
      return toggleRelationshipFeature(value)

    default:
      return {error: `${featureName} is not a valid feature name.`}
  }
}
