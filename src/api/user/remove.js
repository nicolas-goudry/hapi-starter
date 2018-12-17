import createDebugger from 'debug'

import get from './get'

const debug = createDebugger('hapi-starter:api:user:remove')

const remove = async (ctx) => {
  debug('Remove user', ctx.user.id)

  const user = await get(ctx)

  await ctx.user.destroy()

  debug('Successfully removed user')

  return user
}

export default remove
