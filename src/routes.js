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

// Controllers
import SessionController from './App/Controllers/SessionController';
import UserController from './App/Controllers/UserController';
import KitchenController from './App/Controllers/KitchenController';

const routes = new Router();
const multer = multer(multerConfig);

routes.get('/', (req, res) => res.json({ message: 'Hello World' }));

// Session Route
routes.post('/sessions', validationSession, SessionController.store);

// User Routes
routes.post('/users', validationUserStore, UserController.store);
routes.put('/users', allow(), validationUserUpdate, UserController.update);

// In development
const todo = (req, res) => res.sendStatus(501); // Not implemented

routes.post('/set_nutri_profile', todo); // Gerar um perfil nutricional do usuário e salvar no db. Apenas usuários autenticados

// Kitchens
routes.get('/kitchens', todo); // Listar as cozinhas por ordem de proximidade
routes.post(
  '/kitchens',
  allow('user'),
  validationKitchenStore,
  KitchenController.store
);
routes.put('/kitchens', todo); // Atualizar uma cozinha (nome, endereço etc.)- apenas usuários autenticados

// Dishes
routes.get('/dishes', todo); // Se o usuário estiver autenticado e possuir um perfil nutricional, listar apenas os pratos recomendados. Caso não, listar todos os pratos. Caso haja query params, retornar com filtros: /dishes?kitchen=1 deve retornar somente os pratos da cozinha com id 1 enquanto /dishes deve retornar todos os pratos
routes.post('/dishes', allow('cooker'), todo);
routes.put('/dishes/:dishId', todo); // Atualizar um prato - Apenas usuários autenticados donos de uma cozinha (role cooker)
routes.delete('/dishes/:dishId', todo); // Remover prato do seu menu (mas não da lista de pratos) - Apenas usuários autenticados donos de uma cozinha (role cooker)

export default routes;
