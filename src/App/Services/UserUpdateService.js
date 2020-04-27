import User from '../Models/User';
import File from '../Models/File';

class UserUpdateService {
  async run({ userId, data }) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw { status: 400, error: 'User not found' };
    }

    if (data.email !== user.email) {
      const userExists = await User.findOne({
        where: { email: data.email },
      });

      if (userExists) {
        throw { status: 400, error: 'User already exists.' };
      }
    }

    if (data.oldPassword && !(await user.checkPassword(data.oldPassword))) {
      throw { status: 401, error: 'Password does not match.' };
    }

    await user.update(data);

    const newUser = await User.findByPk(userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
      attributes: { exclude: ['password', 'avatar_id'] },
    });

    return newUser;
  }
}

export default new UserUpdateService();
