import File from '../Models/File';
import User from '../Models/User';

class AvatarController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const userId = req.auth.aud;

    try {
      const file = await File.create({ name, path });
      const user = await User.findByPk(userId);

      await user.update({ avatar_id: file.id });

      return res.json(file);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new AvatarController();
