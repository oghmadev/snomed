'use strict'

import { Router } from 'express'
import * as health from './health.controller'
import * as middleware from '../../components/middleware'
const router = new Router()

router.get('/', middleware.logRequest('health', health.getHealth.name), health.getHealth)

module.exports = router
