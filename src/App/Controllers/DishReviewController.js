import { Op } from 'sequelize';

import Dish from '../Models/Dish';
import DishReview from '../Models/DishReview';
import Kitchen from '../Models/Kitchen';

class DishReviewController {
  async store(req, res) {
    const { dishId } = req.params;
    const data = req.body;
    const userId = req.auth.aud;

    const dish = await Dish.scope('getKitchen').findOne({
      where: { id: dishId },
    });

    if (!dish) return res.status(404).json({ error: 'Dish not found' });

    if (dish.kitchen.user.id === userId)
      return res.status(400).json({ error: 'You cannot comment in this Dish' });

    try {
      const [_, created] = await DishReview.findOrCreate({
        where: { user_id: userId, dish_id: dishId },
        defaults: { ...data, user_id: userId, dish_id: dishId },
      });

      if (!created) {
        return res
          .status(400)
          .json({ error: 'You already made a review in this dish' });
      }

      return res.sendStatus(201);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req, res) {
    const { dishId } = req.params;
    const data = req.body;
    const userId = req.auth.aud;

    if (!(await Dish.findOne({ where: { id: dishId } })))
      return res.status(404).json({ error: 'Dish not found' });

    try {
      const dishReview = await DishReview.findOne({
        user_id: userId,
        dish_id: dishId,
      });

      dishReview.update(data);

      return res.sendStatus(202);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    const { dishId } = req.params;
    const userId = req.auth.aud;

    try {
      await DishReview.destroy({ where: { dish_id: dishId, user_id: userId } });

      return res.sendStatus(202);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new DishReviewController();
