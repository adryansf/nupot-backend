import { Router } from 'express';
import multer from 'multer';

import multerConfig from './Config/multer';

// Middlewares
import allow from './App/Middlewares/permission';

// Validators
import validationSession from './App/Validators/SessionStore';
import validationUserStore from './App/Validators/UserStore';
import validationUserUpdate from './App/Validators/UserUpdate';
import validationKitchenIndex from './App/Validators/KitchenIndex';
import validationKitchenStore from './App/Validators/KitchenStore';
import validationKitchenUpdate from './App/Validators/KitchenUpdate';
import validationMenuIndex from './App/Validators/MenuIndex';
import validationUserNutriotionalProfiles from './App/Validators/UserNutritionalProfiles';
import validationDishStore from './App/Validators/DishStore';
import validationDishUpdate from './App/Validators/DishUpdate';
import validationDishReviewStore from './App/Validators/DishReviewStore';
import validationDishReviewUpdate from './App/Validators/DishReviewUpdate';

// Controllers
import SessionController from './App/Controllers/SessionController';
import UserController from './App/Controllers/UserController';
import KitchenController from './App/Controllers/KitchenController';
import DishController from './App/Controllers/DishController';
import AvatarController from './App/Controllers/AvatarController';
import UserNutritionalProfilesController from './App/Controllers/UserNutritionalProfilesController';
import DishPhotoController from './App/Controllers/DishPhotoController';
import DishReviewPhotoController from './App/Controllers/DishReviewPhotoController';
import DishReviewController from './App/Controllers/DishReviewController';

const routes = new Router();
const upload = multer(multerConfig);

// Session Route
routes.post('/sessions', validationSession, SessionController.store);

// User Routes
routes.post('/users', validationUserStore, UserController.store);
routes.put(
  '/users',
  allow('user'),
  validationUserUpdate,
  UserController.update
);

// Files Uplaod
routes.post(
  '/avatars',
  allow('user'),
  upload.single('file'),
  AvatarController.store
);

routes.post(
  '/dishes/:dishId/photo',
  allow('kitchen'),
  upload.single('file'),
  DishPhotoController.store
);

routes.post(
  '/dishes/:dishId/reviews/photo',
  allow('user'),
  upload.single('file'),
  DishReviewPhotoController.store
);

// Kitchens
routes.get('/kitchens', validationKitchenIndex, KitchenController.index);
routes.post(
  '/kitchens',
  allow('user'),
  validationKitchenStore,
  KitchenController.store
);
routes.put(
  '/kitchens',
  validationKitchenUpdate,
  allow('kitchen'),
  KitchenController.update
);
routes.delete('/kitchens', allow('kitchen'), KitchenController.delete);

// Dishes
routes.get('/dishes', validationMenuIndex, DishController.index);
routes.get('/dishes/:dishId', DishController.show);
routes.post(
  '/dishes',
  allow('kitchen'),
  validationDishStore,
  DishController.store
);
routes.put(
  '/dishes/:dishId',
  allow('kitchen'),
  validationDishUpdate,
  DishController.update
);
routes.delete('/dishes/:dishId', allow('kitchen'), DishController.destroy);

// Review
routes.post(
  '/dishes/:dishId/reviews',
  allow('user'),
  validationDishReviewStore,
  DishReviewController.store
);

routes.put(
  '/dishes/:dishId/reviews',
  allow('user'),
  validationDishReviewUpdate,
  DishReviewController.update
);

routes.delete(
  '/dishes/:dishId/reviews',
  allow('user'),
  DishReviewController.delete
);

// User Nutritional Profile
routes.post(
  '/users/nutritional_profiles',
  allow('user'),
  validationUserNutriotionalProfiles,
  UserNutritionalProfilesController.store
);

routes.put(
  '/users/nutritional_profiles',
  allow('user'),
  validationUserNutriotionalProfiles,
  UserNutritionalProfilesController.update
);

// In development
const todo = (req, res) => res.sendStatus(501); // Not implemented

// Gerar um perfil nutricional do usuário e salvar no db. Apenas usuários autenticados

export default routes;
