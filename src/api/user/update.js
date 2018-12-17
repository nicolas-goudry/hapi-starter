import createDebugger from 'debug'
import omit from 'lodash.omit'

import get from './get'

const debug = createDebugger('hapi-starter:api:user:update')

const update = async (ctx, args) => {
  debug('Update authenticated user', ctx.user.id)
  debug(JSON.stringify(omit(args, 'password'), null, 2))

  await ctx.user.update(args)

  debug('Return updated user')

  return get(ctx)
}

export default update
