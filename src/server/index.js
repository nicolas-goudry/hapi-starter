
import configJson from 'config.json'
import createDebugger from 'debug'
import Hapi from 'hapi'
import path from 'path'

import routes from '/routes'
import boot from './boot'

const debug = createDebugger('hapi-starter:server')

// Load environment config file
const config = configJson(
  path.resolve(__dirname, '../config/config.json')
)

/**
 * This function starts the server
 * @returns {Object} Hapi.js server
 */
const start = async () => {
  debug('Load Hapi.js')

  // Load Hapi.js
  const hapi = new Hapi.Server({
    port: config.port || 3000,
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

  debug('Load plugins')

  // Load Hapi.js plugins
  await boot.plugins(hapi, config)

  debug('Initialize database')

  // Initialize database
  await boot.database(hapi.plugins['hapi-sequelizejs'][config.sequelize.name])

  debug('Setup Hapi.js')

  // Initialize Hapi.js
  await boot.hapi(hapi, config, routes)

  debug('Setup Apollo server')

  // Initialize Apollo Server
  await boot.apollo(hapi)

  debug('Start server')

  // Start Hapi.js
  await hapi.start()

  return hapi
}

export default start
