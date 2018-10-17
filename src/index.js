import Aigle from 'aigle'

import initServer from './server'

global.Promise = Aigle

initServer()
  .then((server) => {
    server.app.log(`Server started at ${server.info.uri}`)
    server.app.log(`Connected to ${server.app.config.sequelize.name} database at ${server.app.config.sequelize.host}:${server.app.config.sequelize.port}`)
  })
  .catch(console.error)
