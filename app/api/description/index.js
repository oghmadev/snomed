'use strict'

import { Router } from 'express'
import * as description from './description.controller'
import { validateParams } from '../../components/middleware'

const router = new Router()
const idParams = [{
  source: 'params',
  name: 'id'
}]

router.get('/fsn/:id', validateParams(idParams, 'description', description.getFSN.name), description.getFSN)
router.get('/synonym/:id', validateParams(idParams, 'description', description.getSynonyms.name), description.getSynonyms)
router.get('/complete/:id', validateParams(idParams, 'description', description.getComplete.name), description.getComplete)
router.get('/:id', validateParams(idParams, 'description', description.getDescription.name), description.getDescription)

module.exports = router
