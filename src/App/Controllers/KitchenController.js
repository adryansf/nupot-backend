// Services
import KitchenIndexService from '../Services/KitchenIndexService';
import KitchenStoreService from '../Services/KitchenStoreService';
import KitchenUpdateService from '../Services/KitchenUpdateService';

class KitchenController {
  async index(req, res) {
    const { latitude, longitude } = req.query;
    const userId = req.auth.aud;

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
}

export default new KitchenController();
