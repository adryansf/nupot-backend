import Kitchen from '../Models/Kitchen';
import User from '../Models/User';
import File from '../Models/File';

class KitchenUpdateService {
  async run({ data, userId }) {
    const kitchen = await Kitchen.findOne({
      where: { user_id: userId },
    });

    if (!kitchen) {
      throw { status: 400, error: 'You do not have a kitchen' };
    }

    await kitchen.update(data);

    const newKitchen = await Kitchen.findOne({
      where: { user_id: userId },
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

    return newKitchen;
  }
}

export default new KitchenUpdateService();
