'use strict'

import { Router } from 'express'
import * as disorder from './disorder.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/', middleware.logRequest('disorder', disorder.getDisorderByCriteria.name), disorder.getDisorderByCriteria)

module.exports = router
