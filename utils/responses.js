const mongoose = require('mongoose');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const OK = 200;
const CREATED = 201;

const resOk = (req, res) => {
  if (!req) {
    return res.status(NOT_FOUND).send({
      message: 'Данный id не содержит данных',
    });
  }
  return res.status(OK).send(req);
};

const resError = (err, res) => {
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    return res.status(BAD_REQUEST).send({
      message: 'Введенные данные  некорректны',
    });
  }

  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(NOT_FOUND).send({
      message: 'Ресурс с указанным id не был найден',
    });
  }

  return res.status(SERVER_ERROR).send({
    message: 'Произошла ошибка на сервере',
  });
};

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
  resOk,
  resError,
};
