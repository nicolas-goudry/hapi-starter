import { User } from 'api'

const resolvers = {
  Query: {
    user: (root, args, context, info) => User.get(context, args)
  },
  Mutation: {
    signup: (root, args, context, info) => User.signup(context, args),
    login: (root, args, context, info) => User.login(context, args),
    updateUser: (root, args, context, info) => User.update(context, args),
    deleteUser: (root, args, context, info) => User.remove(context, args)
  }
}

export default resolvers
