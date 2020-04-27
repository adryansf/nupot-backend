// Services
import KitchenStoreService from '../Services/KitchenStoreService';

class KitchenController {
  async store(req, res) {
    const data = req.body;
    const userId = req.auth.aud;
    try {
      const kitchen = await KitchenStoreService.run({ data, userId });
      return res.json(kitchen);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new KitchenController();
