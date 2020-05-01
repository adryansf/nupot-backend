import Sequelize, { Model } from 'sequelize';

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
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Kitchen, { foreignKey: 'kitchen_id', as: 'dish' });
    this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  }
}

export default Dish;
