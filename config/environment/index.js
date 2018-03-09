'use strict'

import path from 'path'
import shared from '../../config/environment/shared'

const all = {
  env: process.env.NODE_ENV,
  root: path.normalize(`${__dirname}/../../..`),
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
  secrets: {session: 'snomed-secret'}
}

module.exports = Object.assign(all, shared, require(`./${process.env.NODE_ENV}.js`) || {})
