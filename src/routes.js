import { Router } from 'express';
import multer from 'multer';

import multerConfig from './Config/multer';

// Validators
import validationSession from './App/Validators/SessionStore';
import validationUserStore from './App/Validators/UserStore';
import validationUserUpdate from './App/Validators/UserUpdate';

// Controllers
import SessionController from './App/Controllers/SessionController';
import UserController from './App/Controllers/UserController';

const routes = new Router();
const multer = multer(multerConfig);

routes.get('/', (req, res) => res.json({ message: 'Hello World' }));

// Session Route
routes.post('/sessions', validationSession, SessionController.store);

// User Routes
routes.post('/users', validationUserStore, UserController.store);
routes.post('/users/:id', validationUserUpdate, UserController.update);

export default routes;
