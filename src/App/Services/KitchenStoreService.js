import Kitchen from '../Models/Kitchen';
import Role from '../Models/Role';
import UserRole from '../Models/UserRole';

class KitchenStoreService {
  async run({ data, userId }) {
    const kitchenExists = await Kitchen.findOne({
      where: { user_id: userId },
    });

    if (kitchenExists) {
      throw { status: 401, error: 'You cannot create more of one kitchen' };
    }

    const legalIdExists = await Kitchen.findOne({
      where: { legal_id: data.legal_id },
    });

    if (legalIdExists) {
      throw { status: 401, error: 'Legal ID already in use' };
    }

    const kitchen = await Kitchen.create({
      ...data,
      user_id: userId,
    });

    const role = await Role.findOne({ where: { name: 'kitchen' } });

    await UserRole.create({
      user_id: userId,
      role_id: role.id,
    });

    return kitchen;
  }
}

export default new KitchenStoreService();
