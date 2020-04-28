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

// Controllers
import SessionController from './App/Controllers/SessionController';
import UserController from './App/Controllers/UserController';
import KitchenController from './App/Controllers/KitchenController';
import DishController from './App/Controllers/DishController';
import AvatarController from './App/Controllers/AvatarController';

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

// In development
const todo = (req, res) => res.sendStatus(501); // Not implemented

routes.post('/set_nutri_profile', todo); // Gerar um perfil nutricional do usuário e salvar no db. Apenas usuários autenticados

// Kitchens
routes.get('/kitchens', KitchenController.index); // Listar as cozinhas por ordem de proximidade
routes.post(
  '/kitchens',
  allow('user'),
  validationKitchenStore,
  KitchenController.store
);
routes.put('/kitchens', validationKitchenUpdate, KitchenController.update); // Atualizar uma cozinha (nome, endereço etc.)- apenas usuários autenticados

// Dishes
routes.get('/dishes', validationMenuIndex, DishController.index); // Se o usuário estiver autenticado e possuir um perfil nutricional, listar apenas os pratos recomendados. Caso não, listar todos os pratos. Caso haja query params, retornar com filtros: /dishes?kitchen=1 deve retornar somente os pratos da cozinha com id 1 enquanto /dishes deve retornar todos os pratos
routes.get('/dishes/:dishId', DishController.show);
routes.post('/dishes', allow('kitchen'), DishController.store);
routes.put('/dishes/:dishId', allow('kitchen'), todo); // Atualizar um prato - Apenas usuários autenticados donos de uma cozinha (role cooker)
routes.delete('/dishes/:dishId', allow('kitchen'), todo); // Remover prato do seu menu (mas não da lista de pratos) - Apenas usuários autenticados donos de uma cozinha (role cooker)

export default routes;
