import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-hapi'
import createDebugger from 'debug'

const debug = createDebugger('hapi-starter:directives')

class IsAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const resolver = field.resolve

    field.resolve = async (root, args, ctx) => {
      const { auth: { isAuthenticated, token }, server: { app: { config, jwt } } } = ctx.request

      if (!isAuthenticated) {
        debug('Authentication missing')

        throw new AuthenticationError('You must authenticate')
      }

      if (ctx.user.id && token) {
        debug('Checking token against authenticated user')

        try {
          const verified = (await jwt.verify(token, config.jwt.secret)).id === ctx.user.id

          if (!verified) {
            debug('Token doesn’t match authenticated user')

            throw new AuthenticationError('Token data doesn’t match')
          }
        } catch (err) {
          debug('bcrypt error')
          debug(JSON.stringify(err, null, 2))

          throw new AuthenticationError(`[${err.name}] ${err.message}${err.expiredAt ? ` (expired at: ${err.expiredAt})` : ''}`)
        }

        debug('Authentication valid')

        return resolver(root, args, ctx)
      }

      debug('Invalid or missing authentication')
      debug(JSON.stringify(ctx, null, 2))

      throw new AuthenticationError('Invalid or missing authentication')
    }
  }
}

const makeScopeDirective = (scope) => class IsScopeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const resolver = field.resolve

    field.resolve = async (root, args, ctx) => {
      if (!ctx.request.auth.isAuthenticated) {
        debug('isAdmin: Authentication missing')

        throw new AuthenticationError('You must authenticate')
      }

      if (!ctx.user) {
        debug('isAdmin: No user in context')

        throw new AuthenticationError('Invalid user')
      }

      if (ctx.user.scope === scope) {
        debug('isAdmin: Scope valid')

        return resolver(root, args, ctx)
      }

      debug('isAdmin: Invalid or missing scope')
      debug(JSON.stringify(ctx.user, null, 2))

      throw new AuthenticationError('Invalid or missing scope')
    }
  }
}

const schemaDirectives = {
  isAuthenticated: IsAuthDirective,
  isAdministrator: makeScopeDirective('admin'),
  isUser: makeScopeDirective('user')
}

export default schemaDirectives
