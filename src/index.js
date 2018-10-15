import Aigle from 'aigle'

import initServer from './server'

global.Promise = Aigle

initServer()
  .then((server) => {
    server.app.log(`Server started at ${server.info.uri}`)
    server.app.log(`Connected to ${process.env.DB_NAME} database at ${process.env.DB_HOST}:${process.env.DB_PORT}`)
  })
  .catch(console.error)
