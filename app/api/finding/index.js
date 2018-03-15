'use strict'

import { Router } from 'express'
import * as finding from './finding.controller'
import { validateParams } from '../../components/middleware'

const router = new Router()
const queryParams = [{
  source: 'query',
  name: 'criteria'
}]

router.get('/', validateParams(queryParams, 'finding', finding.getFindingsByCriteria.name), finding.getFindingsByCriteria)

module.exports = router
