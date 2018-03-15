'use strict'

import { Router } from 'express'
import * as features from './features.controller'
import { logRequest } from '../../components/middleware'

const router = new Router()

router.get('/source', logRequest('features', features.source.name), features.source)

module.exports = router
