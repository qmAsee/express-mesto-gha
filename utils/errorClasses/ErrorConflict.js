const { CONFLICT } = require('../responses');

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = Conflict;
