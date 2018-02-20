'use strict'

import SequelizeErrorHandler from './sequelize.handler'
import SironaErrorHandler from './sirona.handler'
import NodeErrorHandler from './node.handler'
import { BaseError as SequelizeBaseError } from 'sequelize/lib/errors'
import { BaseError as SironaBaseError } from '../errors'

export default function (error) {
  switch (true) {
    case error instanceof SironaBaseError:
      return Promise.resolve(SironaErrorHandler(error))

    case error instanceof SequelizeBaseError:
      return Promise.resolve(SequelizeErrorHandler(error))

    case error instanceof Error:
      return Promise.resolve(NodeErrorHandler(error))

    default:
      return Promise.resolve('unhandledException')
  }
}
