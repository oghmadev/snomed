'use strict'

import { Router } from 'express'
import * as sports from './sports.controller'
import { validateParams } from '../../components/middleware'

const router = new Router()
const queryParams = [{
  source: 'query',
  name: 'criteria'
}]

router.get('/', validateParams(queryParams, 'sports', sports.getSportsByCriteria.name), sports.getSportsByCriteria)

module.exports = router
