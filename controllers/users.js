const userModel = require('../models/user');
const
  {
    OK,
    CREATED,
    resOk,
    resError,
  } = require('../utils/responses');

const createUser = (req, res) => {
  userModel
    .create(req.body)
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

module.exports = {
  createUser,
  updateUser,
  findUserById,
  getUsers,
  uploadAvatar,
};
