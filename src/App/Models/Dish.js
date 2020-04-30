import Sequelize, { Model } from 'sequelize';

// Models
import File from '../Models/File';
import NutritionalProfile from '../Models/NutritionalProfile';
import Kitchen from '../Models/Kitchen';
import DishReview from '../Models/DishReview';

class Dish extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        money: Sequelize.STRING,
        price: Sequelize.FLOAT,
        description: Sequelize.STRING,
      },
      {
        sequelize,
        defaultScope: {
          attributes: { exclude: ['photo_id'] },
          include: [
            {
              model: File,
              as: 'photo',
            },
            {
              model: NutritionalProfile,
              as: 'nutritional_profiles',
            },
          ],
        },
        scopes: {
          getKitchen: {
            include: [
              {
                model: Kitchen,
                as: 'kitchen',
              },
            ],
          },
          getReviews: {
            include: [
              {
                model: DishReview,
                as: 'reviews',
                limit: 10,
                order: [['updated_at', 'desc']],
              },
            ],
          },
        },
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.NutritionalProfile, {
      hooks: true,
      through: 'dish_nutritional_profiles',
      as: 'nutritional_profiles',
    });
    this.belongsTo(models.Kitchen, { foreignKey: 'kitchen_id', as: 'kitchen' });
    this.belongsTo(models.File, { foreignKey: 'photo_id', as: 'photo' });
    this.hasMany(models.DishReview, { foreignKey: 'dish_id', as: 'reviews' });
  }
}

export default Dish;
