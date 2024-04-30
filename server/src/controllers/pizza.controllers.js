import factory from './handlerFactory.js';
import { Pizza } from '../models/index.js';

const createPizza = factory.createOne(Pizza);
const getAllPizzas = factory.getAll(Pizza, 'name', 'price', 'ingredients');
const retrievePizza = factory.getOne(Pizza);
const updatePizza = factory.updateOne(Pizza, 'name', 'price', 'ingredients', 'photo');
const deletePizza = factory.deleteOne(Pizza);

export default {
  getAllPizzas,
  createPizza,
  retrievePizza,
  updatePizza,
  deletePizza,
};
