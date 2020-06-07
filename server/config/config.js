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
    // heroku with postgres addon
    process.env.DATABASE_URL && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
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
    {
      logging: false,
      use_env_variable: 'BOOKAY_DB_URL'
    }
}
