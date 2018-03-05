'use strict'

import { Router } from 'express'
import * as procedure from './procedure.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/count', middleware.logRequest('procedure', procedure.countProcedureByCriteria.name), procedure.countProcedureByCriteria)
router.get('/', middleware.logRequest('procedure', procedure.getProcedureByCriteria.name), procedure.getProcedureByCriteria)

module.exports = router
