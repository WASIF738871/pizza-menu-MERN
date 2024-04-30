import Joi from 'joi';

const createPizza = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    ingredients: Joi.string(),
    price: Joi.number().required(),
    photo: Joi.string(),
    soldOut: Joi.boolean(),
  }),
};

const updatePizza = {
  body: Joi.object().keys({
    name: Joi.string(),
    ingredients: Joi.string(),
    price: Joi.number(),
    photo: Joi.string(),
    soldOut: Joi.boolean(),
  }),
};

export default { createPizza, updatePizza };
