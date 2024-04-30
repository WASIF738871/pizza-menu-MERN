import mongoose from 'mongoose';

import { paginate, docList, toJSON } from './plugins/index.js';

// Define the schema for the pizza collection
const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
});

// add plugin that converts mongoose to json
pizzaSchema.plugin(toJSON);
pizzaSchema.plugin(paginate);
pizzaSchema.plugin(docList);

pizzaSchema.statics.isPizzaNameTaken = async function (name) {
  const pizza = await this.findOne({ name });
  return !!pizza;
};

// Create the model for the 'pizza' collection using the schema
const Pizza = mongoose.model('Pizza', pizzaSchema);

export default Pizza;
