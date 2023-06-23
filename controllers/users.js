const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const BadRequest = require('../utils/errorClasses/ErrorBadRequest');
const Conflict = require('../utils/errorClasses/ErrorConflict');
const NotFound = require('../utils/errorClasses/ErrorNotFound');
const Unauthorized = require('../utils/errorClasses/ErrorUnauthorized');

const { JWT_SECRET, STATUS } = process.env;

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

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        return next(new NotFound('Не удается создать пользователя'));
      }
      return res.status(CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidatonError') {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      if (err.status === 409) {
        next(new Conflict('Пользователь с введенным email уже зарегистрирован'));
        return;
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
      if (!user) {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidatonError') {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      next(err);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.status(OK).send(user);
    })
    .catch(next);
};

const findUserById = (req, res, next) => {
  userModel
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
        return;
      }
      next(err);
    })
    .catch(next);
};

const getUsers = async (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.status(OK).send({ users });
    })
    .catch(next);
};

const uploadAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Почта или пароль неверны'));
        return;
      }
      if (!bcrypt.compare(password, user.password)) {
        next(new Unauthorized('Почта или пароль неверны'));
        return;
      }
      res.status(OK).send({
        token: jwt.sign(
          { _id: user._id },
          STATUS === 'production' ? JWT_SECRET : 'some-secret-key',
          { expiresIn: '7d' },
        ),
        status: res.statusCode,
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
