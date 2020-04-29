import { Router } from 'express';
import multer from 'multer';

import multerConfig from './Config/multer';

// Middlewares
import allow from './App/Middlewares/permission';

// Validators
import validationSession from './App/Validators/SessionStore';
import validationUserStore from './App/Validators/UserStore';
import validationUserUpdate from './App/Validators/UserUpdate';
import validationKitchenStore from './App/Validators/KitchenStore';
import validationKitchenUpdate from './App/Validators/KitchenUpdate';
import validationMenuIndex from './App/Validators/MenuIndex';
import validationUserNutriotionalProfiles from './App/Validators/UserNutritionalProfilesStore';

// Controllers
import SessionController from './App/Controllers/SessionController';
import UserController from './App/Controllers/UserController';
import KitchenController from './App/Controllers/KitchenController';
import DishController from './App/Controllers/DishController';
import AvatarController from './App/Controllers/AvatarController';
import UserNutritionalProfiles from './App/Controllers/UserNutritionalProfilesController';

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

// Kitchens
routes.get('/kitchens', KitchenController.index);
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

// Dishes
routes.get('/dishes', validationMenuIndex, DishController.index);
routes.get('/dishes/:dishId', DishController.show);
routes.post('/dishes', allow('kitchen'), DishController.store);
routes.put('/dishes/:dishId', allow('kitchen'), DishController.update);
routes.delete('/dishes/:dishId', allow('kitchen'), DishController.destroy);

// User Nutritional Profile
routes.post(
  '/users/nutritional_profiles',
  allow('user'),
  validationUserNutriotionalProfiles,
  UserNutritionalProfiles.store
);

// In development
const todo = (req, res) => res.sendStatus(501); // Not implemented

// Gerar um perfil nutricional do usuário e salvar no db. Apenas usuários autenticados

export default routes;
