import Kitchen from '../Models/Kitchen';
import User from '../Models/User';
import File from '../Models/File';

class KitchenIndexService {
  async run({ latitude, longitude, userId }) {
    const kitchens = await Kitchen.scope({
      method: ['nearBy', latitude, longitude, userId],
    }).findAll({
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['avatar_id', 'password'],
          },
          include: [
            {
              model: File,
              as: 'avatar',
            },
          ],
        },
      ],
    });

    return kitchens;
  }
}

export default new KitchenIndexService();
