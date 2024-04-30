import httpStatus from 'http-status';

import { catchAsync } from '../utils/index.js';
import { userServices } from '../services/index.js';

import factory from './handlerFactory.js';
import { User } from '../models/index.js';

const createUser = (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: 'fail',
    message: 'Route is not found! Please use /signup instead',
  });
};

const getAllUsers = factory.getAll(User, 'firstName', 'lastName', 'email');
const retrieveUser = factory.getOne(User);
const updateMe = factory.updateOne(User, 'firstName', 'lastName', 'email');
const updateUser = factory.updateOne(User, 'firstName', 'lastName', 'email');
const deleteUser = factory.deleteOne(User);

const deleteMe = catchAsync(async (req, res) => {
  await userServices.retrieveUserAndUpdate(req.user.id, { active: false });
  res.status(httpStatus.NO_CONTENT).json();
});

export default {
  getAllUsers,
  createUser,
  retrieveUser,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
};
