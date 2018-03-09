'use strict'

import { Router } from 'express'
import * as disorder from './disorder.controller'
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

router.get('/synonym', validateParams(queryParams, 'disorder', disorder.getDisorderSynonymByCriteria.name), disorder.getDisorderSynonymByCriteria)
router.get('/count', validateParams(queryParams, 'disorder', disorder.countDisorderByCriteria.name), disorder.countDisorderByCriteria)
router.get('/', validateParams(pageParams, 'disorder', disorder.getDisorderByCriteria.name), disorder.getDisorderByCriteria)

module.exports = router
