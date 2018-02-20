'use strict'

import path from 'path'

export default function (app) {
  app.use('/api/conditions', require('./api/condition'))
  app.use('/api/allergyIntolerances', require('./api/allergyIntolerance'))
  app.use('/api/files', require('./api/file'))
  app.use('/api/histories', require('./api/history'))
  app.use('/api/immunizations', require('./api/immunization'))
  app.use('/api/insurances', require('./api/insurance'))
  app.use('/api/locations', require('./api/location'))
  app.use('/api/maps', require('./api/map'))
  app.use('/api/medications', require('./api/medication'))
  app.use('/api/nurse', require('./api/nurse'))
  app.use('/api/patients', require('./api/patient'))
  app.use('/api/practitioners', require('./api/practitioner'))
  app.use('/api/problems', require('./api/problem'))
  app.use('/api/procedures', require('./api/procedure'))
  app.use('/api/turns', require('./api/turn'))
  app.use('/api/users', require('./api/user'))
  app.use('/api/snomed', require('./api/snomed'))
  app.use('/auth', require('./api/auth'))

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
