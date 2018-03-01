'use strict'

import { Router } from 'express'
import * as association from './association.controller'
import * as middleware from '../../components/middleware/index'

const router = new Router()

router.get('/children', middleware.logRequest('association', association.getChildren.name), association.getChildren)
router.get('/parent', middleware.logRequest('association', association.getParents.name), association.getParents)

module.exports = router
