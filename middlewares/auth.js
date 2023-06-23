const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errorClasses/ErrorUnauthorized');

const { JWT_SECRET = '64931485be787ff3de1a6132' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new Unauthorized('Для доступа требуется авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized('Для доступа требуется авторизация');
  }
  req.user = payload;
  next();
};

module.exports = auth;
