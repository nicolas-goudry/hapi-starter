import crypto from 'crypto'

const config = {
  sequelize: {
    name: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || '',
    options: {}
  },
  jwt: {
    secret: process.env.JWT_SECRET || crypto.randomBytes(256).toString('base64'),
    algorithm: process.env.JWT_ALGO || 'HS256',
    expiresIn: process.env.JWT_EXP || '1h'
  },
  mailer: {
    ses: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    },
    // smtp: {
    //   service: process.env.SMTP_SERVICE,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS
    //   }
    // },
    sender: process.env.EMAIL_SENDER
  }
}

export default config
