'use strict'

import program from 'commander'
import { prompt } from 'inquirer'
import { version } from '../../package'
import * as featureToggles from '../featureToggles'
import * as utils from '../utils'

program
  .version(version)
  .description('Feature Management for SNOMED')

program
  .command('getFeatureHealth <featureName>')
  .option('-f, --featureHealth', 'Returns the status of a feature. If no feature name is provided it returns the status of all features.')
  .action(featureToggles.getFeatureStatus)

program
  .command('toggleFeature <featureName> <value>')
  .option('-t, --toggleFeature', 'Toggles a feature to the provided value.')
  .action(featureToggles.toggleFeature)

program
  .command('uptime')
  .option('-u, --uptime', 'Returns the time since the app was started.')
  .action(() => utils.secondsToTime(process.uptime()))
