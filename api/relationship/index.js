'use strict'

import { Router } from 'express'
import * as relationship from './relationship.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/children', middleware.logRequest('relationship', relationship.getChildren.name), relationship.getChildren)
router.get('/parent', middleware.logRequest('relationship', relationship.getParents.name), relationship.getParents)

module.exports = router
