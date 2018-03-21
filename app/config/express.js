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

function morganJSONFormat (message) {
  const morganParts = message.split(',')
  const partNames = ['timestamp', 'requestId', 'method', 'url', 'status', 'responseTime', 'contentLength', 'referrer', 'remoteUser', 'remoteAddress', 'requestHeader']
  const logObject = {}

  for (let [i, name] of partNames.entries()) {
    logObject[name] = morganParts[i]
  }

  logObject.userAgent = morganParts.slice(partNames.length).join(',')

  return logObject
}

function logExpress (level) {
  return message => {
    logger.express.console[level](message.trim())
    logger.express.file.log(Object.assign(morganJSONFormat(message.trim()), {level}))
  }
}

export default function (app) {
  const env = app.get('env')

  app.use(morgan(morganFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: {write: logExpress('info')}
  }))
  app.use(morgan(morganFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: {write: logExpress('error')}
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
