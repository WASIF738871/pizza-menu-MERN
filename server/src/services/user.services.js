import httpStatus from 'http-status';
import { User } from '../models/index.js';
import ApiError from '../utils/ApiError.utils.js';
import { customValidations } from '../validations/index.js';

const createUser = async (newUser) => {
  if (await User.isEmailTaken(newUser.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User with this email already exists!');
  }
  return await User.create(newUser);
};

const userLogin = async (userObject) => {
  const { email, password } = userObject;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const getAllUsers = async (filter, options) => {
  return await User.docList(filter, options);
};

const getAllUsersPaginated = async (filter, options) => {
  return await User.paginate(filter, options);
};

const retrieveUser = async (id) => {
  if (!customValidations.isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID!');
  }
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return user;
};

const retrieveUserAndUpdate = async (id, doc) => {
  if (!customValidations.isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID!');
  }
  const user = await User.findByIdAndUpdate(id, doc, {
    new: true,
    runValidators: true,
  });
  return user;
};

const findUser = async (filter, message) => {
  const user = await User.findOne(filter);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
  return user;
};

const updateUser = async (id, body) => {
  await retrieveUser(id);
  return await User.findByIdAndUpdate(id, body, {
    new: true,
    // runValidators: true,
  });
};

const deleteUser = async (id) => {
  await retrieveUser(id);
  return await User.deleteOne({ _id: id });
};

const deleteManyUser = async () => {
  return await User.deleteMany();
};

export default {
  createUser,
  userLogin,
  getAllUsers,
  getAllUsersPaginated,
  retrieveUser,
  retrieveUserAndUpdate,
  findUser,
  updateUser,
  deleteUser,
  deleteManyUser,
};
