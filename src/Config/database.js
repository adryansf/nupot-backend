const { resolve } = require('path');

const {
  NODE_ENV = 'development',
  DB_HOST,
  DB_USER,
  DB_PASSWORD = null,
  DB_NAME,
} = process.env;

const config = {
  development: {
    dialect: 'sqlite',
    storage: resolve(__dirname, '..', 'Database', 'db.sqlite'),
  },
  production: {
    dialect: 'postgres',
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
  },
};

module.exports = config[NODE_ENV];
