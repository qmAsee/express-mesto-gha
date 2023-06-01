const userModel = require('../models/user');
const
{ BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED
} = require('../utils/responses')

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(CREATED).send(user)
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

const updateUser = (req, res) => {
  userModel
    .findByIdAndUpdate (
      req.user._id,
      req.body,
      { new: true, runValidators: true}
    )
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Введенные данные некорректны',
          err: err.message,
          stack: err.stack,
        })
      }
      if (err.name === 'NotValidId') {
        res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
          err: err.message,
          stack: err.stack,
        })
      }
      res.status(SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      })
    })
}

const findUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .orFail(new Error('Введён некорректный id'))
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'Error') {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
          error: err.message,
          stack: err.stack,
        })
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Пользователь с указанным id не найден',
          error: err.message,
          stack: err.stack,
        })
      }
      if (err.name === 'NotValidId') {
        res.status(BAD_REQUEST).send({
          message: 'Пользователь с указанным id не найден',
          err: err.message,
          stack: err.stack,
        })
      }
      res.status(SERVER_ERROR).send({
        message: 'Возникла ошибка на сервере',
        error: err.message,
        stack: err.stack,
      })
    })
}

const getUsers = async (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(OK).send(users)
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

const uploadAvatar = (req, res) => {
  const { avatar } = req.body

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Введенные данные некорректны',
          err: err.message,
          stack: err.stack,
        })
      }
      if (err.name === 'NotValidId') {
        res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
          err: err.message,
          stack: err.stack,
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
  createUser,
  updateUser,
  findUserById,
  getUsers,
  uploadAvatar,
}