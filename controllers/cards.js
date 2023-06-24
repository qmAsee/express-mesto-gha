const cardSchema = require('../models/card');
const { CREATED } = require('../utils/responses');
const { OK } = require('../utils/responses');
const Forbidden = require('../utils/errorClasses/ErrorForbidden');
const BadRequest = require('../utils/errorClasses/ErrorBadRequest');
const NotFound = require('../utils/errorClasses/ErrorNotFound');

const createCard = (req, res, next) => {
  cardSchema
    .create({
      ...req.body,
      owner: req.user._id,
    })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
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
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка по указанному id не найдена'));
      } else {
        next(err);
      }
    });
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
        throw new NotFound('Карточка не найдена');
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка по указанному id не найдена'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  cardSchema
    .findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным id не найдена');
    })
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
        next(new Forbidden('Вы не можете удалять чужие карточки'));
      }
    })
    .catch((err) => {
      next(err);
    });
};

const getCards = async (req, res, next) => {
  await cardSchema.find({})
    .then((cards) => {
      res.status(OK).send(cards);
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
