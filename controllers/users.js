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
      next(err);
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

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Почта или пароль неверны'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Почта или пароль неверны'));
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
