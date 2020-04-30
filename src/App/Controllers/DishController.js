import { Op } from 'sequelize';

// Models
import Dish from '../Models/Dish';
import User from '../Models/User';
import Kitchen from '../Models/Kitchen';
import DishNutritionalProfile from '../Models/DishNutritionalProfile';
import NutritionalProfile from '../Models/NutritionalProfile';

import { userHasDish } from './helpers/UserDishes';

class DishController {
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
    const dish = await Dish.scope(
      'defaultScope',
      'getKitchen',
      'getReviews'
    ).findByPk(dishId);
    if (!dish) return res.sendStatus(404);
    return res.json(dish);
  }

  async store(req, res) {
    const { name, price, money = 'BRL', description = null } = req.body;
    let { nutritional_profiles } = req.body;

    nutritional_profiles = nutritional_profiles.map(np => `%${np}%`);

    try {
      const { aud: userId } = req.auth;
      const user = await User.findOne({
        where: { id: userId },
        include: [{ model: Kitchen, as: 'kitchen' }],
      });
      if (!user) return res.status(400).json({ error: 'User not found' });

      const NutritionalProfiles = await NutritionalProfile.findAll({
        where: { name: { [Op.iLike]: { [Op.any]: nutritional_profiles } } },
      });

      if (NutritionalProfiles.length === 0) {
        return res
          .status(400)
          .json({ error: 'Nutritional Profiles not found.' });
      }

      const dish = await Dish.create({ name, price, money, description });
      await user.kitchen.addDish(dish);

      for (let { id } of NutritionalProfiles) {
        await DishNutritionalProfile.create({
          dish_id: dish.id,
          nutritional_profile_id: id,
        });
      }

      return res.sendStatus(201);
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({ error });
    }
  }

  async update(req, res) {
    const { dishId } = req.params;
    const { aud: userId } = req.auth;
    const userIsDishOwner = await userHasDish(userId, dishId);
    if (!userIsDishOwner) return res.sendStatus(403);

    let { nutritional_profiles } = req.body;
    nutritional_profiles = nutritional_profiles.map(np => `%${np}%`);

    const { name, money, price, description } = req.body;

    const NutritionalProfiles = await NutritionalProfile.findAll({
      where: { name: { [Op.iLike]: { [Op.any]: nutritional_profiles } } },
    });

    if (NutritionalProfiles.length === 0)
      return res.status(400).json({ error: 'Nutritional Profiles not found.' });

    let dishNPs = await DishNutritionalProfile.findAll({
      where: { dish_id: dishId },
    });

    const newValues = {};
    const acceptedFields = { name, money, price, description };
    for (const key in acceptedFields) {
      if (acceptedFields[key]) newValues[key] = acceptedFields[key];
    }
    try {
      await Dish.update(newValues, { where: { id: dishId } });
    } catch (error) {
      return res.sendStatus(500);
    }

    for (let { id } of NutritionalProfiles) {
      if (await dishNPs.some(dnp => dnp.nutritional_profile_id === id)) {
        dishNPs = await dishNPs.filter(
          dnp => dnp.nutritional_profile_id !== id
        );
        continue;
      }

      await DishNutritionalProfile.create({
        dish_id: dishId,
        nutritional_profile_id: id,
      });
    }

    for (let { id } of dishNPs) {
      await DishNutritionalProfile.destroy({ where: { id } });
    }

    return res.sendStatus(204);
  }

  async destroy(req, res) {
    const { dishId } = req.params;
    const { aud: userId } = req.auth;
    const userIsDishOwner = await userHasDish(userId, dishId);
    if (!userIsDishOwner) return res.sendStatus(403);
    await Dish.destroy({ where: { id: dishId } });
    return res.sendStatus(204);
  }
}

export default new DishController();
