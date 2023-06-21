const router = require('express').Router();
const userRoutes = require('./users');
const cardsRouter = require('./cards');
const NotFound = require('../utils/errorClasses/ErrorNotFound');
const createUserValidation = require('../middlewares/fieldsValidaton');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', createUserValidation, login);
router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
