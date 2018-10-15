
import configJson from 'config.json'
import createDebugger from 'debug'
import Hapi from 'hapi'
import ora from 'ora'
import path from 'path'

import boot from './boot'

const debug = createDebugger('hapi-starter:server')

const print = (text, success = false) => {
  if (process.env.NODE_ENV === 'development') {

  }
}

// Load environment config file
const config = configJson(
  path.resolve(__dirname, '../config/config.json')
)

/**
 * This function starts the server
 * @returns {Object} Hapi.js server
 */
const start = async () => {
  const mainSpinner = ora('Starting server').start()

  // Load Hapi.js
  const hapi = new Hapi.Server({
    port: process.env.HAPI_PORT || 3000,
    routes: {
      cors: true
    },
    router: {
      stripTrailingSlash: true
    },
    debug: {
      request: ['error']
    }
  })

  const pluginSpinner = ora('Load plugins').start()

  // Load Hapi.js plugins
  await boot.plugins(hapi, config)

  pluginSpinner.succeed('Plugins loaded!')
  
  const dbSpinner = ora('Initialize database').start()

  // Initialize database
  await boot.database(hapi.plugins['hapi-sequelizejs'][config.db.name])

  dbSpinner.succeed('Database initialized!')

  const hapiSpinner = ora('Setup Hapi.js').start()

  // Initialize Hapi.js
  await boot.hapi(hapi, config)

  hapiSpinner.succeed('Hapi.js setup!')

  const apolloSpinner = ora('Setup Apollo server').start()

  // Initialize Apollo Server
  await boot.apollo(hapi)

  apolloSpinner.succeed('Apollo server setup!')

  // Start Hapi.js
  await hapi.start()

  mainSpinner.succeed('Server started!')

  return hapi
}

export default start
