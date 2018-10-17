import createDebugger from 'debug'
import fs from 'fs'
import path from 'path'
import { loadFile } from 'sequelize-fixtures'

const debug = createDebugger('hapi-starter:seed')

/**
 * This function loads json fixtures files in src/database/seed folder
 * and automatically generates a SQL query to set Sequelize timefields
 * default values to NOW() SQL function
 * @param {Object} db Sequelize database instance
 * @returns {Promise}
 */
const seedDatabase = async (db) => {
  debug('Generate query')

  // We iterate over model names to generate query
  const modelNames = Object.keys(db.models)
  let defaultNow = ''

  for (let i = 0; i < modelNames.length; i++) {
    defaultNow += `ALTER TABLE ${modelNames[i]}
ALTER created_at SET DEFAULT NOW();
ALTER TABLE ${modelNames[i]}
ALTER updated_at SET DEFAULT NOW();
`
  }

  debug('Query generated')
  debug(defaultNow)
  debug('Check for fixtures file')

  const seedPath = path.resolve(__dirname, '../../../database/seed')
  const hasJsonFiles = fs.readdirSync(seedPath).reduce((acc, val) => {
    if (!acc) {
      acc = /.*\.json$/.test(val)
    }

    return acc
  }, false)

  if (hasJsonFiles) {
    debug('Fixtures file found')
  } else {
    debug('No fixtures file found')
  }

  // Execute query and load fixtures files
  return Promise.all([
    db.sequelize.query(defaultNow),
    hasJsonFiles && loadFile(path.resolve(seedPath, '*.json'), db.models)
  ])
}

export default seedDatabase
