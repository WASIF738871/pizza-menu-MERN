import express from 'express';
import { userControllers, authControllers } from '../../controllers/index.js';
import { userValidations } from '../../validations/index.js';
import { validate, authMiddleware, userMiddleware, upload } from '../../middlewares/index.js';

const router = express.Router();

router.post('/signup', validate(userValidations.createUser), authControllers.signup);
router.post('/login', validate(userValidations.userLogin), authControllers.login);
router.post('/forgot-password', validate(userValidations.forgotPassword), authControllers.forgotPassword);
router.patch('/reset-password/:token', validate(userValidations.resetPassword), authControllers.resetPassword);

router.use(authMiddleware.protect);

router.patch('/update-password', validate(userValidations.updateMyPassword), authControllers.updateMyPassword);

router.get('/me', userMiddleware.getMe, userControllers.retrieveUser);
router.patch(
  '/update-me',
  userMiddleware.protectPasswordToBeUpdated,
  userMiddleware.manageParamId,
  validate(userValidations.updateMe),
  upload.single('profileImage'),
  userMiddleware.resizePorfileImage,
  userControllers.updateMe,
);
router.delete('/delete-me', userControllers.deleteMe);

router.use(authMiddleware.restrictTo('admin'));

router.route('/').get(userControllers.getAllUsers).post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.retrieveUser)
  .patch(userMiddleware.protectPasswordToBeUpdated, userControllers.updateUser)
  .delete(userControllers.deleteUser);

export default router;
