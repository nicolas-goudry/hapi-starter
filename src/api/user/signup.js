import { ForbiddenError } from 'apollo-server-hapi'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import createDebugger from 'debug'

import get from './get'

const debug = createDebugger('hapi-starter:api:user:signup')

const signup = async (ctx, { email, password }) => {
  debug('Signup of user', email)

  const existingUser = await get(ctx, { search: email }).catch(() => {})

  if (existingUser) {
    debug('User already exists')

    throw new ForbiddenError('User already exists')
  }

  debug('Hash password')

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  debug('Create tokens')

  const tokens = {
    activation: randomBytes(32).toString('base64'),
    refresh: randomBytes(32).toString('base64')
  }

  debug('Create user in DB')

  const user = await ctx.db.models.user.create({
    email,
    password: hashedPassword,
    activationToken: tokens.activation,
    refreshToken: tokens.refresh
  })

  debug('Sign JWT token and get user data')

  return {
    token: await ctx.request.server.app.jwt.sign({ id: user.id, scope: user.scope }),
    user: await get(ctx, { search: user.id })
  }
}

export default signup
