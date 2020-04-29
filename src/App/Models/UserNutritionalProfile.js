import Sequelize, { Model } from 'sequelize';

class UserNutritionalProfile extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        nutritional_profile_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.NutritionalProfile, {
      foreignKey: 'nutritional_profile_id',
      as: 'nutritional_profile',
    });
  }
}

export default UserNutritionalProfile;
