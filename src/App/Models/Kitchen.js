// Models
import User from '../Models/User';
import File from '../Models/File';
import Dish from '../Models/Dish';
import NutritionalProfile from '../Models/NutritionalProfile';

import Sequelize, { Model, Op } from 'sequelize';

class Kitchen extends Model {
  static init(sequelize) {
    super.init(
      {
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
        legal_id: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        defaultScope: {
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude: ['avatar_id', 'password'],
              },
              include: [
                {
                  model: File,
                  as: 'avatar',
                },
              ],
            },
          ],
        },
        scopes: {
          nearBy(latitude, longitude, id) {
            const haversine = `(6371 * acos(cos(radians(${latitude}))
            * cos(radians(latitude))
            * cos(radians(longitude)
            - radians(${longitude}))
            + sin(radians(${latitude}))
            * sin(radians(latitude))))`;

            return {
              attributes: {
                include: [[Sequelize.literal(haversine), 'distance']],
              },
              where: {
                user_id: { [Op.not]: id },
                active: true,
              },
              order: [[Sequelize.col('distance'), 'asc']],
            };
          },
          nutritionalProfile(nutritional_profile) {
            return {
              include: [
                {
                  model: Dish,
                  as: 'dishes',
                  include: [
                    {
                      model: NutritionalProfile,
                      as: 'nutritional_profiles',
                      where: {
                        name: { [Op.iLike]: `%${nutritional_profile}%` },
                      },
                    },
                  ],
                },
              ],
            };
          },
        },
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.Dish, { foreignKey: 'kitchen_id', as: 'dishes' });
  }
}

export default Kitchen;
