const userModel = require('../models/user');

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      })
    })
}

const updateUser = (req, res) => {
  userModel
    .findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true})
    .orFail(() => {
      throw new Error('UserNotFound')
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      })
    })
}

const findUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .orFail(() => {
      throw new Error('UserNotFound')
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
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
      res.send(users)
    })
    .catch((err) => {
      res.status(500).send({
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
    .orFail(() => {
      throw new Error('UserNotFound')
    })
    .then((user) => {
      res.send(user)
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
  createUser,
  updateUser,
  findUserById,
  getUsers,
  uploadAvatar,
}