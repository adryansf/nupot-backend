const { resolve } = require('path');

const { NODE_ENV = 'development', DATABASE_URL = null } = process.env;

const config = {
  development: {
    dialect: 'sqlite',
    storage: resolve(__dirname, '..', 'Database', 'db.sqlite'),
  },
  production: {
    dialect: 'postgres',
    url: DATABASE_URL,
  },
};

module.exports = config[NODE_ENV];
