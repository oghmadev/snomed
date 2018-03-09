'use strict'

import { Router } from 'express'
import * as substance from './substance.controller'
import { validateParams } from '../../components/middleware'

const router = new Router()
const queryParams = [{
  source: 'query',
  name: 'criteria'
}]

router.get('/', validateParams(queryParams, 'substance', substance.getSubstanceByCriteria.name), substance.getSubstanceByCriteria)

module.exports = router
