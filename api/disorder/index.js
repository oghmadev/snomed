'use strict'

import { Router } from 'express'
import * as disorder from './disorder.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/synonym', middleware.logRequest('disorder', disorder.getDisorderSynonymByCriteria.name), disorder.getDisorderSynonymByCriteria)
router.get('/count', middleware.logRequest('disorder', disorder.countDisorderByCriteria.name), disorder.countDisorderByCriteria)
router.get('/', middleware.logRequest('disorder', disorder.getDisorderByCriteria.name), disorder.getDisorderByCriteria)

module.exports = router
