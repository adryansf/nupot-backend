import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { resolve } from 'path';

// Routes
import routes from './routes';

// Middlewares
import auth from './App/Middlewares/auth';

// Database
import './Database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(express.json());
    this.server.use(auth);
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
