import Dish from '../Models/Dish';
import User from '../Models/User';
import Kitchen from '../Models/Kitchen';

class DishController {
  async store(req, res) {
    const { name, price, money = 'REAL', description = null } = req.body;
    try {
      const { aud: userId } = req.auth;
      const user = await User.findByPk(userId);
      if (!user) return res.status(400).json({ error: 'user not found' });
      const dish = await Dish.create({ name, price, money, description });
      await user.kitchen.addDish(dish);
      return res.sendStatus(201);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

export default new DishController();
