const cardSchema = require('../models/card');
const { CREATED } = require('../utils/responses');
const { OK } = require('../utils/responses');
const BadRequest = require('../utils/errorClasses/ErrorBadRequest');
const NotFound = require('../utils/errorClasses/ErrorNotFound');
const Forbidden = require('../utils/errorClasses/ErrorForbidden');

const createCard = (req, res, next) => {
  cardSchema
    .create({
      ...req.body,
      owner: req.user._id,
    })
    .then((card) => {
      res.status(CREATED).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка по указанному id не найдена'));
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFound('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка по указанному id не найдена'));
      }
      next(err);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена'));
        return;
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка по указанному id не найдена'));
      }
      next(err);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  cardSchema
    .findById(req.params.cardId)
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        cardSchema
          .deleteOne(card)
          .then((removedCard) => {
            res.status(OK).send({
              data: removedCard,
              message: 'Карточка удалена',
            });
          })
          .catch(next);
      } else {
        throw new Forbidden('Не удалось удалить карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFound('Карточка по указанному id не найдена'));
      }
      next();
    })
    .catch(next);
};

const getCards = async (req, res, next) => {
  await cardSchema.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
