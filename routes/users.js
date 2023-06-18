const router = require('express').Router();

const {
  findUserByIdValidation,
  updateUserValidation,
  uploadAvatarValidation,
  loginValidation,
  createUserValidation,
} = require('../middlewares/fieldsValidaton');

const {
  createUser,
  updateUser,
  findUserById,
  getUsers,
  uploadAvatar,
  login,
  getCurrentUser,
} = require('../controllers/users');

router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', uploadAvatarValidation, uploadAvatar);
router.get('/:userId', findUserByIdValidation, findUserById);
router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.get('/', getUsers);
router.get('/me', getCurrentUser);

module.exports = router;
