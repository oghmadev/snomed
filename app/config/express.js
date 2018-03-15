'use strict'

import morgan from 'morgan'
import shrinkRay from 'shrink-ray'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import config from './environment'
import logger from '../config/logs'

const morganFormat = ':date[iso],:req[X-Request-ID],:method,:url,:status,:response-time,:res[content-length],:referrer,:remote-user,:remote-addr,:req[header],:user-agent'

export default function (app) {
  const env = app.get('env')

  app.use(morgan(morganFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: {write: message => logger.express.info(message.trim())}
  }))
  app.use(morgan(morganFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: {write: message => logger.express.error(message.trim())}
  }))
  app.set('views', config.root + '/server/views')
  app.engine('html', require('ejs').renderFile)
  app.set('view engine', 'html')
  app.use(shrinkRay())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(methodOverride())
  app.use(cookieParser())

  if (env === 'development' || env === 'test') app.use(errorHandler()) // Error handler - has to be last
}
