const router = require('express').Router();

const {
  findUserByIdValidation,
  updateUserValidation,
  uploadAvatarValidation,
} = require('../middlewares/fieldsValidaton');

const {
  updateUser,
  findUserById,
  getUsers,
  uploadAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', uploadAvatarValidation, uploadAvatar);
router.get('/:userId', findUserByIdValidation, findUserById);
router.get('/', getUsers);

module.exports = router;
