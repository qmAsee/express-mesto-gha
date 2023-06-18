const http2 = require('http2');

const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;
const CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;
const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;
const UNAUTH = http2.constants.HTTP_STATUS_UNAUTHORIZED;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
  CONFLICT,
  FORBIDDEN,
  UNAUTH,
};
