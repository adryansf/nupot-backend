import Dish from '../Models/Dish';
import User from '../Models/User';
import Kitchen from '../Models/Kitchen';

class DishController {
  async store(req, res) {
    const { name, price, money = 'REAL', description = null } = req.body;
    try {
      const { aud: userId } = req.auth;
      const user = await User.findOne({
        where: { id: userId },
        include: [{ model: Kitchen, as: 'kitchen' }],
      });
      if (!user) return res.status(400).json({ error: 'user not found' });
      const dish = await Dish.create({ name, price, money, description });
      await user.kitchen.addDish(dish);
      return res.sendStatus(201);
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({ error });
    }
  }

  async index(req, res) {
    const { query } = req;
    const filters = {};
    const attrs = { kitchen: 'kitchen_id' }; // filter map: query params -> table column
    Object.keys(attrs).map(key => {
      if (query[key]) filters[attrs[key]] = query[key];
    });
    const dishes = await Dish.findAll({ where: filters });
    return res.json(dishes);
  }

  async show(req, res) {
    const { dishId } = req.params;
    const dish = await Dish.findByPk(dishId);
    if (!dish) return res.sendStatus(404);
    return res.json(dish);
  }
}

export default new DishController();
