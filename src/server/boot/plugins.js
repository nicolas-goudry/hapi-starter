import createDebugger from 'debug'
import jwtAuth from 'hapi-auth-jwt2'
import path from 'path'

const debug = createDebugger('hapi-starter:plugins')

/**
 * This function loads Hapi.js plugins from environment configuration file
 * @param {Object} hapi Hapi.js server instance
 * @param {Object} config Environment configuration
 * @returns {Promise} Hapi.js plugin register Promise
 */
const loadPlugins = async (hapi, config) => {
  debug('Load plugins setup')

  // We iterate over config keys to load plugins
  const configKeys = Object.keys(config)
  const plugins = []

  for (let i = 0; i < configKeys.length; i++) {
    debug('Setup plugin', configKeys[i])

    // Load plugin file
    const plugin = require(path.resolve(__dirname, '../plugins', configKeys[i])).default
    const options = config[configKeys[i]]

    // Add plugin to array
    if (typeof plugin === 'function') {
      plugins.push(plugin(options))
    } else {
      plugins.push({
        plugin,
        options
      })
    }
  }

  debug('Register plugins')

  return hapi.register([
    jwtAuth,
    ...plugins
  ])
}

export default loadPlugins
