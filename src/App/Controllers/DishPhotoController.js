import File from '../Models/File';
import Dish from '../Models/Dish';
import Kitchen from '../Models/Kitchen';

class DishPhotoController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const userId = req.auth.aud;
    const { dishId } = req.params;

    try {
      const kitchen = await Kitchen.findOne({ where: { user_id: userId } });

      if (!kitchen)
        return res.status(404).json({ error: 'You do not have a kitchen' });

      const dish = await Dish.findOne({ where: { id: dishId } });

      if (!dish) return res.status(404).json({ error: 'Dish not found' });

      if (dish.kitchen_id !== kitchen.id) return res.sendStatus(401);

      const file = await File.create({ name, path });

      dish.photo_id = file.id;

      await dish.save();

      return res.json(file);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new DishPhotoController();
