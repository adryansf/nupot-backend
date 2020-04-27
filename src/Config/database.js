const { resolve } = require('path');

const { NODE_ENV = 'development' } = process.env;
const config = {
  development: {
    dialect: 'sqlite',
    storage: resolve(__dirname, '..', 'Database', 'devPublicDB.sqlite'),
  },
  production: {
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
};

module.exports = config[NODE_ENV];
