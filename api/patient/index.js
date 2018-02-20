'use strict'

import { Router } from 'express'
import * as patient from './patient.controller'
import * as middleware from '../../components/middleware/index'

const router = new Router()

router.get('/all', middleware.hasRole(['admin', 'practitioner', 'manager', 'admission']), middleware.logRequest('patient', patient.findByCriteria.name), patient.findByCriteria)
router.get('/count', middleware.hasRole(['admin', 'practitioner', 'manager', 'admission']), middleware.logRequest('patient', patient.count.name), patient.count)
router.get('/page', middleware.hasRole(['admin', 'practitioner', 'manager', 'admission']), middleware.logRequest('patient', patient.getPageByCriteria.name), patient.getPageByCriteria)
router.get('/:id', middleware.hasRole(['admin', 'practitioner', 'manager', 'admission']), middleware.logRequest('patient', patient.show.name), patient.show)
router.put('/:id', middleware.hasRole(['practitioner', 'manager', 'admission']), middleware.logRequest('patient', patient.upsert.name), patient.upsert)
router.post('/', middleware.hasRole(['practitioner', 'admission', 'manager']), middleware.logRequest('patient', patient.create.name), patient.create)

module.exports = router
