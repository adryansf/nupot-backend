// Models
import File from '../Models/File';
import Role from '../Models/Role';
import NutritionalProfile from '../Models/NutritionalProfile';

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
        defaultScope: {
          attributes: {
            exclude: ['avatar_id'],
          },
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
            {
              model: Role,
              as: 'roles',
            },
          ],
        },
        scopes: {
          nutritionalProfile: {
            include: [
              {
                model: NutritionalProfile,
                as: 'nutritional_profiles',
              },
            ],
          },
        },
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.changed('password'))
        user.password = await bcrypt.hash(user.password, 8);
    });

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Role, {
      hooks: true,
      through: 'user_roles',
      as: 'roles',
    });
    this.belongsToMany(models.NutritionalProfile, {
      hooks: true,
      through: 'user_nutritional_profiles',
      as: 'nutritional_profiles',
    });
    this.hasOne(models.Kitchen, { foreignKey: 'user_id', as: 'kitchen' });
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  generateToken() {
    const payload = {
      aud: this.id,
      roles: this.roles.map(role => role.name),
      nutritional_profiles: this.nutritional_profiles.map(np => np.name),
    };
    return jwt.sign(payload, APP_SECRET, { expiresIn: JWT_LIFESPAN });
  }
}

export default User;
