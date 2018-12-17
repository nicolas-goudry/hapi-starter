import createDebugger from 'debug'

const debug = createDebugger('hapi-starter:api:user:get')

const get = async (ctx, { id } = {}) => {
  let user = ctx.user

  if (id) {
    user = await ctx.db.models.user.findOne({
      where: {
        uuid: id
      }
    })

    if (!user) {
      debug('User not found')

      throw Error('User not found')
    }
  }

  return {
    ...user.dataValues
  }
}

export default get
