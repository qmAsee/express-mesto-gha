const cardSchema = require('../models/card');
const
  {
    OK,
    CREATED,
    resOk,
    resError,
  } = require('../utils/responses');

const createCard = (req, res) => {
  cardSchema
    .create({
      ...req.body,
      owner: req.user._id,
    })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const putLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(new Error('Карточка с указанным id не найдена'))
    .then((card) => {
      resOk(card, res);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const deleteLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(new Error('Карточка с указанным id не найдена'))
    .then((card) => {
      resOk(card, res);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const deleteCard = (req, res) => {
  cardSchema
    .findByIdAndDelete(req.params.cardId)
    .orFail(new Error('Карточка с указанным id не найдена'))
    .then((card) => {
      resOk(card, res);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const getCards = (req, res) => {
  cardSchema.find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      resError(err, res);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
