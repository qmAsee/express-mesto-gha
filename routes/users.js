const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  createUser,
  updateUser,
  findUserById,
  getUsers,
  uploadAvatar,
} = require('../controllers/users.js');

router.post('/', createUser);
router.patch('/me', updateUser);
router.get('/', getUsers);
router.patch('/me/avatar', uploadAvatar);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  })
}), findUserById);

module.exports = router;