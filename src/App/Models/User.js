import Sequelize, { Model } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { APP_SECRET, JWT_LIFESPAN } = process.env;

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasOne(models.Provider, { foreignKey: 'user_id', as: 'provider' });
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  generateToken() {
    const payload = { aud: this.id, roles: this.roles };
    return jwt.sign(payload, APP_SECRET, { expiresIn: JWT_LIFESPAN });
  }
}

export default User;
