import app from './'
import mongoose from 'mongoose'

after(function (done) {
  app.snomedService.on('close', () => done())
  mongoose.connection.close()
  app.snomedService.close()
})
