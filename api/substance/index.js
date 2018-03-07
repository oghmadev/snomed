'use strict'

import { Router } from 'express'
import * as substance from './substance.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/', middleware.hasRequestId(), middleware.logRequest('substance', substance.getSubstanceByCriteria.name), substance.getSubstanceByCriteria)

module.exports = router
