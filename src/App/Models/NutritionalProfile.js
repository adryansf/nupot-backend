import Sequelize, { Model } from 'sequelize';

class NutritionalProfile extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default NutritionalProfile;
