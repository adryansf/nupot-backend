import Sequelize, { Model, Op } from 'sequelize';

class Kitchen extends Model {
  static init(sequelize) {
    super.init(
      {
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
        legal_id: Sequelize.STRING,
      },
      {
        sequelize,
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
              },
              order: [[Sequelize.col('distance'), 'asc']],
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
