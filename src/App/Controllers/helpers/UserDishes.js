import User from '../../Models/User';
import Kitchen from '../../Models/Kitchen';
import Dish from '../../Models/Dish';

export const getUserDishes = async userId => {
  const user = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: Kitchen,
        as: 'kitchen',
        include: [{ model: Dish, as: 'dishes' }],
      },
    ],
  });
  return user.kitchen.dishes;
};

export const userHasDish = async (userId, dishId) => {
  const dishes = await getUserDishes(userId);
  for (const dish of dishes) {
    if (dish.id === Number(dishId)) return true;
  }
  return false;
};
