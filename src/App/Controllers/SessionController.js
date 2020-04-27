import User from '../Models/User';
import File from '../Models/File';
import Role from '../Models/Role';
import UserRole from '../Models/UserRole';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
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
      attributes: {
        exclude: ['avatar_id'],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = user.generateToken();

    user.password = undefined;

    return res.json({ user, token });
  }
}

export default new SessionController();
