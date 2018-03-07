'use strict'

import { Router } from 'express'
import * as description from './description.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/fsn/:id', middleware.hasRequestId(), middleware.logRequest('description', description.getFSN.name), description.getFSN)
router.get('/synonym/:id', middleware.hasRequestId(), middleware.logRequest('description', description.getSynonyms.name), description.getSynonyms)
router.get('/complete/:id', middleware.hasRequestId(), middleware.logRequest('description', description.getComplete.name), description.getComplete)
router.get('/:id', middleware.hasRequestId(), middleware.logRequest('description', description.getDescription.name), description.getDescription)

module.exports = router
