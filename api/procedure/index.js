'use strict'

import { Router } from 'express'
import * as procedure from './procedure.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/synonym', middleware.hasRequestId(), middleware.logRequest('procedure', procedure.getProcedureSynonymByCriteria.name), procedure.getProcedureSynonymByCriteria)
router.get('/count', middleware.hasRequestId(), middleware.logRequest('procedure', procedure.countProcedureByCriteria.name), procedure.countProcedureByCriteria)
router.get('/', middleware.hasRequestId(), middleware.logRequest('procedure', procedure.getProcedureByCriteria.name), procedure.getProcedureByCriteria)

module.exports = router
