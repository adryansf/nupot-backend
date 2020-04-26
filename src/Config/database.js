const { resolve } = require('path');

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
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};

module.exports = process.env.NODE_ENV ? config.development : config.production;
