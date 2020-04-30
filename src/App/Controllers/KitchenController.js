// Models
import Kitchen from '../Models/Kitchen';

// Services
import KitchenIndexService from '../Services/KitchenIndexService';
import KitchenStoreService from '../Services/KitchenStoreService';
import KitchenUpdateService from '../Services/KitchenUpdateService';

class KitchenController {
  async index(req, res) {
    const {
      latitude,
      longitude,
      nutritional_profile = null,
      page = 1,
    } = req.query;
    const userId = req.auth.aud;
    const kitchensForPage = 10;

    if (!(latitude && longitude)) {
      return res
        .status(400)
        .json({ error: 'You need to inform your location' });
    }

    try {
      const kitchens = await KitchenIndexService.run({
        latitude,
        longitude,
        userId,
        page,
        kitchensForPage,
        nutritional_profile,
      });
      return res.json(kitchens);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async store(req, res) {
    const data = req.body;
    const userId = req.auth.aud;
    try {
      const kitchen = await KitchenStoreService.run({ data, userId });
      return res.json(kitchen);
    } catch ({ status = 500, error }) {
      return res.status(status).json(error);
    }
  }

  async update(req, res) {
    const data = req.body;
    const userId = req.auth.aud;
    try {
      const kitchen = await KitchenUpdateService.run({ data, userId });
      return res.json(kitchen);
    } catch ({ status = 500, error }) {
      return res.status(status).json(error);
    }
  }

  async delete(req, res) {
    const userId = req.auth.aud;

    try {
      const kitchen = await Kitchen.findOne({ where: { user_id: userId } });
      if (!kitchen) return res.sendStatus(404);
      kitchen.active = false;
      await kitchen.save();
      return res.sendStatus(202);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new KitchenController();
