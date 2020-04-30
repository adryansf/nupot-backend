import User from '../Models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.scope('defaultScope', 'nutritionalProfile').findOne(
      {
        where: { email },
      }
    );

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
