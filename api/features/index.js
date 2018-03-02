'use strict'

import { Router } from 'express'
import * as features from './features.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/source', middleware.logRequest('features', features.source.name), features.source)

module.exports = router
