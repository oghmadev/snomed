'use strict'

import { Router } from 'express'
import * as auth from './auth.controller'
import * as middleware from '../../components/middleware'
import config from '../../config/environment'
import { User } from '../../sqldb'

require('./passport').setup(User, config)

const router = new Router()

router.post('/local', middleware.logRequest('auth', auth.authenticate.name), auth.authenticate)

module.exports = router
