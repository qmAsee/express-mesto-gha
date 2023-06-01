const cardSchema = require('../models/card');
const
{ BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED
} = require('../utils/responses')

const createCard = (req, res) => {
  cardSchema
    .create({
      ...req.body,
      owner: req.user._id
    })
    .then((card) => {
      res.status(CREATED).send(card)
    })
    .catch ((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Введенные данные некорректны',
          err: err.message,
          stack: err.stack
        })
      }
      res.status(SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.name,
        stack: err.stack,
      })
    })
}

const putLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: {likes: req.user._id} },
      { new: true }
    )
    .orFail(new Error('Карточка с указанным id не найдена'))
    .then((card) => {
      res.status(OK).send(card)
    })
    .catch ((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Введенные данные некорректны',
          err: err.message,
          stack: err.stack
        })
      }
      if (err.message === 'NotValidId') {
        res.status(BAD_REQUEST).send({
          message: 'Карточка с указанным id не найден',
          err: err.message,
          stack: err.stack,
        })
      }
      if (err.name === 'Error') {
        return res.status(NOT_FOUND).send({
          message: 'Карточка с указанным id не найдена',
          error: err.message,
          stack: err.stack,
        })
      }
      res.status(SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.name,
        stack: err.stack,
      })
    })
}

const deleteLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: {likes: req.user._id} },
      { new: true }
    )
    .orFail(new Error('Карточка с указанным id не найдена'))
    .then((card) => {
      res.status(OK).send(card)
    })
    .catch ((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Введенные данные некорректны',
          err: err.message,
          stack: err.stack
        })
      }
      if (err.message === 'NotValidId') {
        res.status(BAD_REQUEST).send({
          message: 'Карточка с указанным id не найден',
          err: err.message,
          stack: err.stack,
        })
      }
      if (err.name === 'Error') {
        return res.status(NOT_FOUND).send({
          message: 'Карточка с указанным id не найдена',
          error: err.message,
          stack: err.stack,
        })
      }
      res.status(SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.name,
        stack: err.stack,
      })
    })
}

const deleteCard = (req, res) => {
  cardSchema
    .findByIdAndDelete(req.params.cardId)
    .orFail(new Error('Карточка с указанным id не найдена'))
    .then((res) => {
      res.status(OK).send(card)
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        res.status(OK).send({
          message: 'Карточка удалена',
        })
      }
      if (err.name === 'Error') {
        return res.status(NOT_FOUND).send({
          message: 'Карточка с указанным id не найдена',
          error: err.message,
          stack: err.stack,
        })
      }
      if (err.name === 'NotValidId') {
        res.status(BAD_REQUEST).send({
          message: 'Карточка с указанным id не найден',
          err: err.message,
          stack: err.stack,
        })
      }
      res.status(SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.name,
        stack: err.stack,
      })
    })
}

const getCards = (req, res) =>  {
  cardSchema.find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Введенные данные некорректны',
          err: err.message,
          stack: err.stack
        })
      }
      res.status(SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      })
    })
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
}