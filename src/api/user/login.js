import Aigle from 'aigle'
import { AuthenticationError } from 'apollo-server-hapi'
import bcrypt from 'bcryptjs'
import createDebugger from 'debug'

import get from './get'

const debug = createDebugger('hapi-starter:api:user:login')
const compare = Aigle.promisify(bcrypt.compare)

const login = async (ctx, { email, password }) => {
  debug('Login of user', email)

  let user = await ctx.db.models.user.findOne({
    where: {
      email
    }
  })

  if (!user.isActive) {
    debug('User is not active')

    if (user.activationToken) {
      debug('User is not verified')

      throw new AuthenticationError('User not verified')
    }

    throw new AuthenticationError('User deactivated')
  }

  debug('Checking password')

  const valid = await compare(password, user.password)

  if (!valid) {
    debug('Invalid password')

    throw new AuthenticationError('Invalid password')
  }

  debug('Sign token and get user data')

  return {
    token: await ctx.request.server.app.jwt.sign({ id: user.id, scope: user.scope }),
    user: await get(ctx, { id: user.uuid })
  }
}

export default login
