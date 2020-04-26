import bcrypt from 'bcryptjs';
import generateToken from '../Libs/generateToken';

import User from '../Schemas/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    user.password = undefined;

    const token = generateToken(user._id);

    return res.json({ user, token });
  }
}

export default new SessionController();
