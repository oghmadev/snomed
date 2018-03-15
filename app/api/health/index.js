'use strict'

import { Router } from 'express'
import * as health from './health.controller'
import { logRequest } from '../../components/middleware'

const router = new Router()

router.get('/', logRequest('health', health.getHealth.name), health.getHealth)

module.exports = router
