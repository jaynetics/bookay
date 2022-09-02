const path = require('path')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, 'development_db.sqlite')
  },
  test: {
    dialect: 'sqlite',
    logging: !!process.env.DEBUG,
    storage: path.resolve(__dirname, 'test_db.sqlite')
  },
  production:
    // heroku / fly.io with postgres
    process.env.DATABASE_URL && {
      dialectOptions: {
        ssl: process.env.FLY_APP_NAME ? false : {
          require: true,
          rejectUnauthorized: false // required setting for heroku
        }
      },
      logging: false,
      use_env_variable: 'DATABASE_URL'
    }
    || // config via json in env
    process.env.BOOKAY_DB_JSON && {
      logging: false,
      ...JSON.parse(process.env.BOOKAY_DB_JSON)
    }
    || // config via url in env
    process.env.BOOKAY_DB_URL && {
      logging: false,
      use_env_variable: 'BOOKAY_DB_URL'
    }
}
