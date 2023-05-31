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
router.get('/:userId', findUserById);
router.get('/', getUsers);
router.patch('/me/avatar', uploadAvatar);

module.exports = router;