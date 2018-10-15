/**
 * This function sets your models associations on server start
 * @param {Object} db Sequelize instance
 * @example
 * db.models.example.belongsTo(models.otherTable, {
 *   as: 'OtherTable',
 *   foreignKey: 'other_table_id',
 *   targetKey: 'id'
 * })
 * db.models.otherTable.hasMany(models.example, {
 *   as: 'Examples',
 *   sourceKey: 'id',
 *   foreignKey: 'other_table_id'
 * })
 * @throws {Error} Original Sequelize error
 * @returns {null}
 */
const associations = async (db) => {
  // Place your models association here
}

export default associations
