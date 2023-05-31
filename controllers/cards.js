const cardSchema = require('../models/card');

const createCard = (req, res) => {
  cardSchema
    .create({
      ...req.body,
      owner: req.user._id
    })
    .then((card) => {
      res.status(201).send(card)
    })
    .catch ((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.name,
        stack: err.stack,
      })
    })
}

const likeCard = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: {likes: req.user._id} },
      { new: true }
    )
    .then((card) => {
      res.status(201).send(card)
    })
    .catch ((err) => {
      res.status(500).send({
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
    .then((card) => {
      res.status(201).send(card)
    })
    .catch ((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.name,
        stack: err.stack,
      })
    })
}

const deleteCard = (req, res) => {
  cardSchema
    .findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new Error('CardNotFound')
    })
    .then((res) => {
      res.status(200).send(card)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.name,
        stack: err.stack,
      })
    })
}

const getCards = (req, res) =>  {
  cardSchema.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
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
  likeCard,
  deleteLike,
}