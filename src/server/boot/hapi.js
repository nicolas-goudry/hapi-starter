import Boom from 'boom'
import createDebugger from 'debug'
import omit from 'lodash.omit'

const debug = createDebugger('hapi-starter:hapi')

/**
 * This function setups Hapi.js server
 * @param {Object} hapi Hapi.js server instance
 * @param {Object} config Environment configuration
 * @returns {Promise} Hapi.js start Promise
 */
const bootHapi = async (hapi, config, routes) => {
  debug('Load strategy')

  // Load JWT strategy as default
  hapi.auth.strategy('jwt', 'jwt', {
    key: config.jwt.secret,
    validate: async (decoded, request) => {
      return {
        isValid: true
      }
    },
    verifyOptions: { algorithms: ['HS256'] }
  })
  hapi.auth.default({
    mode: 'optional',
    strategies: ['jwt']
  })

  debug('Load hooks')

  // Setup maintenance mode
  hapi.ext('onRequest', (request, reply) => {
    if (request.path !== '/maintenance' && (process.env.MAINTENANCE === 'true' || process.env.MAINTENANCE === true)) {
      return reply(Boom.serverUnavailable('Maintenance in progress'))
    }

    return reply.continue
  })

  debug('Load routes')

  // Register routes
  hapi.route(routes)

  debug('Expose app stuff')

  // Expose plugins and config
  hapi.app.jwt = hapi.plugins['jwt']
  hapi.app.mailer = hapi.plugins['mailer']
  hapi.app.config = config
  hapi.app.log = debug

  // Expose config keys to env
  Object.keys(config).forEach((key) => {
    if (config[key].env) {
      process.env[key] = omit(config[key], 'env')
    }
  })
}

export default bootHapi
