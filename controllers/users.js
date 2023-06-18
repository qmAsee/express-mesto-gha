const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const BadRequest = require('../utils/errorClasses/ErrorBadRequest');
const Conflict = require('../utils/errorClasses/ErrorConflict');
const NotFound = require('../utils/errorClasses/ErrorNotFound');
const Unauthorized = require('../utils/errorClasses/ErrorUnauthorized');

const
  {
    OK,
    CREATED,
  } = require('../utils/responses');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 12)
    .then((hash) => userModel.create({
      password: hash,
      name,
      about,
      avatar,
      email,
    }))
    .then((user) => {
      res.status(CREATED).send({ user });
    })
  // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidatonError') {
        return next(new BadRequest('Введены некорректные данные'));
      }
      if (err.name === 'MongoServerError') {
        return next(new Conflict('Пользователь с введенным email уже зарегистрирован'));
      }
      next(err);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidatonError') {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      if (err.message === 'NotFound') {
        next(new NotFound('Пользователь по указанному id не найден'));
        return;
      }
      next(err);
    });
};

const findUserById = (req, res, next) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      next(err);
    });
};

const getUsers = async (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const uploadAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Почта или пароль неверны'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Почта или пароль неверны'));
          }
          return res.send({
            token: jwt.sign(
              { _id: user._id },
              'some-secret-key',
              { expiresIn: '7d' },
            ),
          });
        });
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
