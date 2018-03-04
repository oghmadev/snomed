'use strict'

import { Router } from 'express'
import * as relationship from './relationship.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/children/direct/:id', middleware.logRequest('relationship', relationship.getChildren.name), relationship.getDirectChildren)
router.get('/children', middleware.logRequest('relationship', relationship.getChildren.name), relationship.getChildren)
router.get('/parents/direct/:id', middleware.logRequest('relationship', relationship.getParents.name), relationship.getDirectParents)
router.get('/parents', middleware.logRequest('relationship', relationship.getParents.name), relationship.getParents)

module.exports = router
