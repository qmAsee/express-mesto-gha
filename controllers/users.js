const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const
  {
    OK,
    CREATED,
    resOk,
    resError,
  } = require('../utils/responses');

const { JWT_SECRET, NODE_ENV } = process.env;

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      password: hash,
      name,
      about,
      avatar,
      email,
    }))
    .then((user) => {
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      resOk(user, res);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const findUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      resOk(user, res);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const getUsers = async (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const uploadAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      resError(err, res);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        httpsOnly: true,
        sameSite: false,
        secure: true,
        maxAge: 360000 * 24 * 7,
      })
        .status(OK).send({ message: 'Авторизация успешна!' });
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUser,
  findUserById,
  getUsers,
  uploadAvatar,
  login,
  getCurrentUser,
};
