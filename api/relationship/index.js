'use strict'

import { Router } from 'express'
import * as relationship from './relationship.controller'
import { validateParams } from '../../components/middleware'

const router = new Router()
const pageParams = [{
  source: 'query',
  name: 'skip'
}, {
  source: 'query',
  name: 'limit'
}, {
  source: 'query',
  name: 'conceptId'
}]
const idParams = [{
  source: 'params',
  name: 'id'
}]

router.get('/children/direct/:id', validateParams(idParams, 'relationship', relationship.getDirectChildren.name), relationship.getDirectChildren)
router.get('/children', validateParams(pageParams, 'relationship', relationship.getChildren.name), relationship.getChildren)
router.get('/parents/direct/:id', validateParams(idParams, 'relationship', relationship.getDirectParents.name), relationship.getDirectParents)
router.get('/parents', validateParams(pageParams, 'relationship', relationship.getParents.name), relationship.getParents)

module.exports = router
