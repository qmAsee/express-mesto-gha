const router = require('express').Router();
const userRoutes = require('./users');
const cardsRouter = require('./cards');
const NotFound = require('../utils/errorClasses/ErrorNotFound');
const auth = require('../middlewares/auth');

router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardsRouter);

router.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
