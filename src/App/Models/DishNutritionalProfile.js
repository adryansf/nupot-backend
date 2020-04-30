import Sequelize, { Model } from 'sequelize';

class DishNutritionalProfile extends Model {
  static init(sequelize) {
    super.init(
      {
        dish_id: Sequelize.INTEGER,
        nutritional_profile_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Dish, { foreignKey: 'dish_id', as: 'dish' });
    this.belongsTo(models.NutritionalProfile, {
      foreignKey: 'nutritional_profile_id',
      as: 'nutritional_profile',
    });
  }
}

export default DishNutritionalProfile;
