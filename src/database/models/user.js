module.exports = (sequelize, DataTypes) => sequelize.define('user', {
  id: {
    autoIncrement: true,
    comment: 'id of the user',
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED
  },
  uuid: {
    comment: 'universal unique identifier of the user',
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  email: {
    allowNull: false,
    comment: 'email of the user',
    type: DataTypes.STRING,
    unique: 'unique_user_by_scope',
    validate: {
      isEmail: true
    }
  },
  password: {
    comment: 'password of the user',
    type: DataTypes.STRING,
    validate: {
      is: /.{6,}/i
    }
  },
  firstName: {
    comment: 'first name of the user',
    field: 'first_name',
    type: DataTypes.STRING
  },
  lastName: {
    comment: 'last name of the user',
    field: 'last_name',
    type: DataTypes.STRING
  },
  activationToken: {
    comment: 'activation token of the user',
    field: 'activation_token',
    type: DataTypes.STRING,
    unique: true
  },
  refreshToken: {
    comment: 'refresh token of the user (used to log without email/password)',
    field: 'refresh_token',
    type: DataTypes.TEXT('long')
  },
  isActive: {
    allowNull: false,
    comment: 'validity of the user (verified or not)',
    field: 'is_active',
    defaultValue: false,
    type: DataTypes.BOOLEAN
  },
  scope: {
    allowNull: false,
    comment: 'scope of the user account',
    defaultValue: 'user',
    type: DataTypes.ENUM('admin', 'companion', 'user'),
    unique: 'unique_user_by_scope'
  }
}, {
  sequelize,
  tableName: 'user'
})
