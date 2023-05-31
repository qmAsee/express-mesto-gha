const router = require('express').Router();
const userRoutes = require('./users');
const cardsRouter = require('./cards')

router.use('/users', userRoutes);
router.use('/cards', cardsRouter)

router.use((req, res, next) => {
  next(res.status(404).send({ message: 'Страница не найдена'}));
})

module.exports = router;