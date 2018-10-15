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
    context: ({ request }) => ({
      request,
      user: request.auth && request.auth.credentials && request.auth.credentials.id ? request.auth.credentials : {}
    }),
    playground: {
      settings: {
        'editor.theme': 'dark',
        'editor.cursorShape': 'underline'
      }
    },
    tracing: process.env.NODE_ENV !== 'production'
  })

  debug('Setup Apollo server')

  await apollo.applyMiddleware({
    app: hapi
  })

  return apollo.installSubscriptionHandlers(hapi.listener)
}

export default bootApollo
