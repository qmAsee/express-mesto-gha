const router = require('express').Router();
const userRoutes = require('./users');
const cardsRouter = require('./cards');
const NotFound = require('../utils/errorClasses/ErrorNotFound');

const {
  loginValidation,
  createUserValidation,
} = require('../middlewares/fieldsValidaton');

const {
  createUser,
  login,
} = require('../controllers/users');

router.use('/users', userRoutes);
router.use('/cards', cardsRouter);

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
