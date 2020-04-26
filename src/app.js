import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
