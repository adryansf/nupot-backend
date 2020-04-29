import { Op } from 'sequelize';
import NutritionalProfile from '../Models/NutritionalProfile';
import UserNutritionalProfile from '../Models/UserNutritionalProfile';

class UserNutritionalProfilesController {
  async store(req, res) {
    const userId = req.auth.aud;
    let { nutritional_profiles } = req.body;

    nutritional_profiles = nutritional_profiles.map(np => `%${np}%`);

    try {
      const NutritionalProfiles = await NutritionalProfile.findAll({
        where: { name: { [Op.iLike]: { [Op.any]: nutritional_profiles } } },
      });

      if (NutritionalProfiles.length === 0) {
        return res
          .status(400)
          .json({ error: 'Nutritional Profiles not found.' });
      }

      for (let { id } of NutritionalProfiles) {
        await UserNutritionalProfile.create({
          user_id: userId,
          nutritional_profile_id: id,
        });
      }

      return res.sendStatus(201);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new UserNutritionalProfilesController();
