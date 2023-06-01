const router = require('express').Router();
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');
const { celebrate, Joi, errors } = require('celebrate');

router.get('/', getCards);
router.post('/', createCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  })
}), deleteCard)

module.exports = router;