import { ApolloServer } from 'apollo-server-hapi'
import createDebugger from 'debug'

import schemaDirectives from 'graphql/directives'
import resolvers from 'graphql/resolvers'
import typeDefs from 'graphql/type_defs.gql'

const debug = createDebugger('hapi-starter:apollo')

/**
 * This function loads and setups Apollo server
 * @param {Object} hapi Hapi.js server instance
 * @returns {Promise} Apollo server start Promise
 */
const bootApollo = async (hapi) => {
  debug('Load Apollo server')

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: async ({ request }) => {
      const db = request.getDb()
      let user

      if (request.auth && request.auth.credentials && request.auth.credentials.id) {
        user = await db.models.user.findByPk(request.auth.credentials.id)
      }

      return {
        db,
        request,
        user
      }
    },
    playground: process.env.NODE_ENV !== 'production' ? {
      settings: {
        'editor.theme': 'dark',
        'editor.cursorShape': 'underline'
      }
    } : false,
    introspection: process.env.NODE_ENV !== 'production',
    tracing: process.env.NODE_ENV !== 'production'
  })

  debug('Initialize Apollo server')

  await apollo.applyMiddleware({
    app: hapi
  })

  return apollo.installSubscriptionHandlers(hapi.listener)
}

export default bootApollo
