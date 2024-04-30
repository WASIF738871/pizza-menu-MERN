import express from 'express';
import { pizzaControllers } from '../../controllers/index.js';
import { pizzaValidations } from '../../validations/index.js';
import { validate, authMiddleware, pizzaMiddleware, upload } from '../../middlewares/index.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(pizzaControllers.getAllPizzas)
  .post(validate(authMiddleware.restrictTo('admin'), pizzaValidations.createPizza), pizzaMiddleware.checkPizzaExists, pizzaControllers.createPizza);
router
  .route('/:id')
  .get(pizzaControllers.retrievePizza)
  .patch(
    authMiddleware.restrictTo('admin'), 
    validate(pizzaValidations.updatePizza),
    upload.single('photo'),
    pizzaMiddleware.resizePhoto,
    pizzaControllers.updatePizza,
  )
  .delete(authMiddleware.restrictTo('admin'), pizzaControllers.deletePizza);

export default router;
