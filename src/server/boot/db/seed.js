import createDebugger from 'debug'
import fs from 'fs'
import path from 'path'
import { loadFile } from 'sequelize-fixtures'

const debug = createDebugger('hapi-starter:seed')

/**
 * This function loads JSON fixtures files/SQL files in seed folder
 * and automatically generates a SQL query to set Sequelize timefields
 * default values to NOW() SQL function
 * @param {Object} db Sequelize database instance
 * @returns {Promise}
 */
const seedDatabase = async (db) => {
  debug('Generate query for timefields default value')

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

  const seedPath = path.resolve(__dirname, '../../../database/seed')
  const seedFiles = fs.readdirSync(seedPath)

  debug('Search for seed files (SQL and JSON)')

  // Search and load SQL files into seed directory
  const sqlQueries = seedFiles.filter((file) => /.*\.sql$/.test(file)).reduce((acc, file) => {
    acc.push(fs.readFileSync(path.resolve(seedPath, file)))

    return acc
  }, []).join('\n')

  // Check into seed directory for JSON files
  const hasJsonFiles = seedFiles.filter((file) => /.*\.json$/.test(file)).length > 0

  if (hasJsonFiles) {
    debug('Fixtures file found')
  } else {
    debug('No fixtures file found')
  }

  // Execute query and load fixtures files
  return Promise.all([
    db.sequelize.query(defaultNow),
    db.sequelize.query(sqlQueries),
    hasJsonFiles && loadFile(path.resolve(seedPath, '*.json'), db.models)
  ])
}

export default seedDatabase
