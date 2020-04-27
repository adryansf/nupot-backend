import User from '../Models/User';
import Role from '../Models/Role';
import UserRole from '../Models/UserRole';

// Services
import UserUpdateService from '../Services/UserUpdateService';

class UserController {
  async store(req, res) {
    try {
      const user = await User.create(req.body);

      const role = await Role.findOne({ where: { name: 'user' } });

      try {
        await UserRole.create({
          user_id: user.id,
          role_id: role.id,
        });
      } catch (error) {
        return res.status(500).json(error);
      }

      return res.json(user);
    } catch (error) {
      return res.json(error);
    }
  }

  async update(req, res) {
    const data = req.body;
    const userId = req.auth.aud;

    try {
      const user = await UserUpdateService.run({ data, userId });
      return res.json(user);
    } catch ({ status = 500, error }) {
      return res.status(status).json(error);
    }
  }
}

export default new UserController();
