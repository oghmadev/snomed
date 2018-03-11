'use strict'

import { Router } from 'express'
import * as medication from './medication.controller'
import { validateParams } from '../../components/middleware'

const router = new Router()
const queryParams = [{
  source: 'query',
  name: 'criteria'
}]
const pageParams = [{
  source: 'query',
  name: 'skip'
}, {
  source: 'query',
  name: 'limit'
}, {
  source: 'query',
  name: 'criteria'
}]

router.get('/', validateParams(queryParams, 'medication', medication.getPresentationByCriteria.name), medication.getPresentationByCriteria)
router.get('/count', validateParams(queryParams, 'medication', medication.countPharmaceuticalProductByCriteria.name), medication.countPharmaceuticalProductByCriteria)
router.get('/', validateParams(pageParams, 'medication', medication.getPharmaceuticalProductByCriteria.name), medication.getPharmaceuticalProductByCriteria)

module.exports = router
