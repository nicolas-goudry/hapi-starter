import createDebugger from 'debug'

import get from './get'

const debug = createDebugger('hapi-starter:api:user:get_all')

const getAll = async (ctx) => {
  debug('Get all users')

  const users = await ctx.db.models.user.findAll({ raw: true, attributes: { include: ['uuid'] } })
  const result = []

  for (let user of users) {
    result.push(await get(ctx, { id: user.uuid }))
  }

  return result
}

export default getAll
