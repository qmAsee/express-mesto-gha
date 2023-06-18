const { UNAUTH } = require('../responses');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTH;
  }
}

module.exports = Unauthorized;
