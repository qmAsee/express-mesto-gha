const router = require('express').Router();
const auth = require('../middlewares/auth');

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

router.use(auth);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', uploadAvatarValidation, uploadAvatar);
router.get('/:userId', findUserByIdValidation, findUserById);
router.post('/sign-in', loginValidation, login);
router.post('/sign-up', createUserValidation, createUser);
router.get('/', getUsers);
router.get('/me', getCurrentUser);

module.exports = router;
