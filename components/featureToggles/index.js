'use strict'

let _isAuthToggled = true
let _isDescriptionToggled = true
let _isFindingToggled = true
let _isRelationshipToggled = true

function toggleAuthFeature (value) {
  if (typeof value === 'boolean') _isAuthToggled = value
}

function isAuthToggled () {
  return _isAuthToggled
}

function toggleDescriptionFeature (value) {
  if (typeof value === 'boolean') _isDescriptionToggled = value
}

function isDescriptionToggled () {
  return _isDescriptionToggled
}

function toggleFindingFeature (value) {
  if (typeof value === 'boolean') _isFindingToggled = value
}

function isFindingToggled () {
  return _isFindingToggled
}

function toggleRelationshipFeature (value) {
  if (typeof value === 'boolean') _isRelationshipToggled = value
}

function isRelationshipToggled () {
  return _isRelationshipToggled
}

module.exports = {
  toggleAuthFeature,
  isAuthToggled,
  toggleDescriptionFeature,
  isDescriptionToggled,
  toggleFindingFeature,
  isFindingToggled,
  toggleRelationshipFeature,
  isRelationshipToggled
}
