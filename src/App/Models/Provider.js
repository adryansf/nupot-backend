import Sequelize, { Model } from 'sequelize';

class Provider extends Model {
  static init(sequelize) {
    super.init(
      {
        location: Sequelize.GEOMETRY('POINT'),
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

export default Provider;
