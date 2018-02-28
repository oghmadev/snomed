'use strict'

import { Router } from 'express'
import * as finding from './finding.controller'
import * as middleware from '../../components/middleware/index'

const router = new Router()

router.get('/', middleware.logRequest('finding', finding.getFindingsByCriteria.name), finding.getFindingsByCriteria)

module.exports = router
