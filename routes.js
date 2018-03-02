'use strict'

import { version } from './package'

export default function (app) {
  const API_PATH = `/api/v${version}`

  app.use(`${API_PATH}/auth`, require('./api/auth'))
  app.use(`${API_PATH}/description`, require('./api/description'))
  app.use(`${API_PATH}/features`, require('./api/features'))
  app.use(`${API_PATH}/finding`, require('./api/finding'))
  app.use(`${API_PATH}/health`, require('./api/health'))
  app.use(`${API_PATH}/relationship`, require('./api/relationship'))

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
