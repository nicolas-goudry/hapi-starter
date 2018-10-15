import associate from 'database/associations'

import seedDatabase from './seed'

/**
 * This function loads database associations and data
 * @param {Object} db Sequelize instance
 * @returns {Promise}
 */
const bootDatabase = async (db) => Promise.all([
  associate(db),
  seedDatabase(db)
])

export default bootDatabase
