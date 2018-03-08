'use strict'

// Set default node environment to development
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Register the Babel require hook
if (env === 'development' || env === 'test') require('babel-register')

// Export the application
exports = module.exports = require('./app')
