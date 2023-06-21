const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errorClasses/ErrorUnauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Для доступа требуется авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new Unauthorized('Для доступа требуется авторизация');
  }
  req.user = payload;
  next();
};

module.exports = auth;
