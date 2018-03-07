'use strict'

import { Router } from 'express'
import * as sports from './sports.controller'
import * as middleware from '../../components/middleware'

const router = new Router()

router.get('/', middleware.logRequest('sports', sports.getSportsByCriteria.name), sports.getSportsByCriteria)

module.exports = router
