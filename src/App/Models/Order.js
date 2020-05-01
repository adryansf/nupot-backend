import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        status: Sequelize.ENUM('ready', 'prepare', 'done'),
        notes: Sequelize.TEXT,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Dish, { foreignKey: 'order_id', as: 'orders' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Kitchen, { foreignKey: 'kitchen_id', as: 'kitchen' });
  }
}

export default Order;
