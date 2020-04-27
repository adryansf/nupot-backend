import Sequelize, { Model } from 'sequelize';

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
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Kitchen;
