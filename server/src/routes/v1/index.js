import express from 'express';

import userRoutes from './user.routes.js';
import pizzaRoutes from './pizza.routes.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/pizzas',
    route: pizzaRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
