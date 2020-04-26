import Sequelize from 'sequelize';

import databaseConfig from '../Config/database';

// Models
import User from '../App/Models/User';
import Provider from '../App/Models/Provider';
import Roles from '../App/Models/Roles';

// Install Models
const models = [User, Provider, Roles];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
