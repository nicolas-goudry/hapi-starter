import hapiSequelize from 'hapi-sequelizejs'
import Sequelize from 'sequelize'

/**
 * This function create the plugin entry for hapi-sequelizejs plugin setup
 * @param {Object} opt Environment sequelize configuration
 * @returns {Object} Configured hapi-sequelizejs plugin
 */
const plugin = (opt) => ({
  plugin: hapiSequelize,
  options: {
    name: opt.name,
    models: ['./.build/src/database/models/**/*.js', './src/database/models/**/*.js'],
    sequelize: new Sequelize(
      opt.name,
      opt.user,
      opt.pass, {
        dialect: 'mysql',
        ...opt.options,
        dialectOptions: {
          multipleStatements: true
        },
        host: opt.host,
        port: opt.port,
        connectionTimeout: 30000,
        pool: {
          max: 15,
          min: 5,
          idle: 60000,
          acquire: 60000
        },
        retry: {
          max: 3
        },
        define: {
          freezeTableNames: true,
          paranoid: true,
          timestamps: true,
          underscored: true
        },
        logging: process.env.NODE_ENV === 'development'
      }
    ),
    sync: true,
    forceSync: false
  }
})

export default plugin
