const router = require('express').Router();
const userRoutes = require('./users');
const cardsRouter = require('./cards');
const NotFound = require('../utils/errorClasses/ErrorNotFound');

router.use('/users', userRoutes);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
