'use strict'

import { Router } from 'express'
import * as practitioner from './practitioner.controller'
import { validateParams } from '../../components/middleware'

const router = new Router()
const queryParams = [{
  source: 'query',
  name: 'criteria'
}]

router.get('/', validateParams(queryParams, 'practitioner', practitioner.getSpecialtyByCriteria.name), practitioner.getSpecialtyByCriteria)

module.exports = router
