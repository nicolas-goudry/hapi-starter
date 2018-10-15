import Aigle from 'aigle'
import jwt from 'jsonwebtoken'

const sign = Aigle.promisify(jwt.sign)
const verify = Aigle.promisify(jwt.verify)
const decode = Aigle.promisify(jwt.decode)

const plugin = {
  name: 'jwt',
  register: function (server, options) {
    server.expose('sign', async (data) => sign(
      data,
      options.secret,
      {
        algorithm: options.algorithm,
        expiresIn: options.expiresIn
      }
    ))
    server.expose('decode', decode)
    server.expose('verify', verify)
  }
}

export default plugin
