const router = require('express').Router();

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
router.get('/:userId', findUserById);

module.exports = router;