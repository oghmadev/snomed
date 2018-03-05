'use strict'

import { version } from './package'
import { getFeatureNames } from './components/featureToggles'

export default function (app) {
  const API_PATH = `/api/v${version}`

  for (let feature of getFeatureNames()) {
    app.use(`${API_PATH}/${feature}`, require(`./api/${feature}`))
  }

  app.use(`${API_PATH}/features`, require('./api/features'))
  app.use(`${API_PATH}/health`, require('./api/health'))

  // All other routes should return a 404
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
