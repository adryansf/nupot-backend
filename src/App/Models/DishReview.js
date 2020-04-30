// Models
import File from './File';
import User from './User';

import Sequelize, { Model } from 'sequelize';

class DishReview extends Model {
  static init(sequelize) {
    super.init(
      {
        comment: Sequelize.STRING,
        stars: Sequelize.INTEGER,
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
              model: User,
              as: 'user',
            },
          ],
        },
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Dish, { foreignKey: 'dish_id', as: 'dish' });
    this.belongsTo(models.File, { foreignKey: 'photo_id', as: 'photo' });
  }
}

export default DishReview;
