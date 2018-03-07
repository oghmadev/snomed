'use strict'

import { Router } from 'express'
import * as finding from './finding.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/', middleware.hasRequestId(), middleware.logRequest('finding', finding.getFindingsByCriteria.name), finding.getFindingsByCriteria)

module.exports = router
