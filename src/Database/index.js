import Sequelize from 'sequelize';

import databaseConfig from '../Config/database';

// Models
import File from '../App/Models/File';
import User from '../App/Models/User';
import Provider from '../App/Models/Provider';
import Roles from '../App/Models/Roles';
import UserRoles from '../App/Models/UserRoles';

// Install Models
const models = [User, Provider, Roles, File, UserRoles];

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
