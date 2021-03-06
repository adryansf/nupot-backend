import Sequelize, { Model } from 'sequelize';

class UserRole extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        role_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
  }
}

export default UserRole;
