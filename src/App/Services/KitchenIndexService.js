import Kitchen from '../Models/Kitchen';

class KitchenIndexService {
  async run({
    page,
    kitchensForPage,
    latitude,
    longitude,
    userId,
    nutritional_profile,
  }) {
    page = Number(page);

    const filterNP = nutritional_profile
      ? { method: ['nutritionalProfile', nutritional_profile] }
      : {};

    const { count, rows: kitchens } = await Kitchen.scope(
      'defaultScope',
      {
        method: ['nearBy', latitude, longitude, userId],
      },
      filterNP
    ).findAndCountAll({
      offset: (page - 1) * 10,
      limit: kitchensForPage,
      attributes: {
        exclude: ['user_id'],
      },
      distinct: true,
      col: 'Kitchen.id',
    });

    const kitchensInPage = kitchens.length;
    const totalPages = Math.ceil(count / kitchensForPage);

    return { total: count, kitchensInPage, page, totalPages, kitchens };
  }
}

export default new KitchenIndexService();
