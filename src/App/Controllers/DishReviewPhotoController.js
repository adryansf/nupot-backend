import File from '../Models/File';
import Dish from '../Models/Dish';
import DishReview from '../Models/DishReview';

class DishReviewPhoto {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const userId = req.auth.aud;
    const { dishId } = req.params;

    try {
      const dish = await Dish.findOne({ where: { id: dishId } });

      if (!dish) return res.status(404).json({ error: 'Dish not found' });

      const dishReview = await DishReview.findOne({
        where: { dish_id: dishId, user_id: userId },
      });

      if (!dishReview)
        return res.status(404).json({ error: 'Dish review not found' });

      const file = await File.create({ name, path });

      dishReview.photo_id = file.id;

      await dishReview.save();

      return res.json(file);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new DishReviewPhoto();
