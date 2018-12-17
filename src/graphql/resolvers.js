import { User } from 'api'

const resolvers = {
  Query: {
    me: (root, args, context) => User.get(context, args),
    user: (root, args, context, info) => User.get(context, args),
    users: (root, args, context) => User.getAll(context, args)
  },
  Mutation: {
    signup: (root, args, context, info) => User.signup(context, args),
    login: (root, args, context, info) => User.login(context, args),
    updateUser: (root, args, context, info) => User.update(context, args),
    deleteUser: (root, args, context, info) => User.remove(context, args)
  }
}

export default resolvers
