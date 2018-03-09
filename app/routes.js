'use strict'

import { version } from '../package'
import { getFeatureNames } from './components/featureToggles'

export default function (app) {
  const API_PATH = `/snomed/v${version}`

  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Request-ID, X-API-Key')
      next()
    })
  }

  for (let feature of getFeatureNames()) {
    app.use(`${API_PATH}/${feature}`, require(`./api/${feature}`))
  }

  app.use(`${API_PATH}/features`, require('./api/features'))
  app.use(`${API_PATH}/health`, require('./api/health'))

  app.route('/*')
    .get(pageNotFound)
}

function pageNotFound (req, res) {
  const viewFilePath = '404'
  const statusCode = 404
  const result = {status: statusCode}

  res.status(result.status)
  res.render(viewFilePath, {}, (err, html) => {
    if (err != null) return res.status(result.status).json(result)

    res.send(html)
  })
}
