const router = require('express').Router();
const userRoutes = require('./users');
const cardsRouter = require('./cards');
const { NOT_FOUND } = require('../utils/responses');

router.use('/users', userRoutes);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(res.status(NOT_FOUND).send({ message: 'Страница не найдена' }));
});

module.exports = router;
