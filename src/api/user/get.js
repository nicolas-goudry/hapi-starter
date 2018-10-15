import { UserInputError } from 'apollo-server-hapi'
import createDebugger from 'debug'
import { Op } from 'sequelize'

const debug = createDebugger('hapi-starter:api:user:get')

const get = async (ctx, { search }) => {
  search = search || ctx.user.id

  debug(`Get${!ctx.user.id ? ' authenticated' : ''} user`, search)

  const user = await ctx.db.models.user.findOne({
    where: {
      [Op.or]: [{
        email: search
      }, {
        id: search
      }]
    }
  })

  if (!user) {
    debug('User not found')

    throw new UserInputError('Invalid user')
  }

  debug('User found')

  return user
}

export default get
