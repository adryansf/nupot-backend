import Sequelize from 'sequelize';
import databaseConfig from '../Config/database';
import models from '../App/Models';

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize({
      ...databaseConfig,
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      },
    });

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
