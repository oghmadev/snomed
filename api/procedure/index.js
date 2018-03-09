'use strict'

import { Router } from 'express'
import * as procedure from './procedure.controller'
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

router.get('/synonym', validateParams(queryParams, 'procedure', procedure.getProcedureSynonymByCriteria.name), procedure.getProcedureSynonymByCriteria)
router.get('/count', validateParams(queryParams, 'procedure', procedure.countProcedureByCriteria.name), procedure.countProcedureByCriteria)
router.get('/', validateParams(pageParams, 'procedure', procedure.getProcedureByCriteria.name), procedure.getProcedureByCriteria)

module.exports = router
