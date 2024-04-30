import sharp from 'sharp';
import httpStatus from 'http-status';

import { ApiError, catchAsync } from '../utils/index.js';
import { Pizza } from '../models/index.js';

const checkPizzaExists = catchAsync(async (req, res, next) => {
  const pizza = await Pizza.isPizzaNameTaken(req.body.name);
  if (pizza) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Pizza with this name "${req.body.name}" already exists!`);
  }
  next();
});

const resizePhoto = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.photo = `pizza-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/${req.body.photo}`);
  }
  next();
});

export default {
  resizePhoto,
  checkPizzaExists,
};
