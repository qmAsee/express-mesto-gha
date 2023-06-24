const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа'],
    maxlength: [30, 'Максимальная длина поля - 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа'],
    maxlength: [30, 'Максимальная длина поля - 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Некорректный URL-адрес ');
      }
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Некорректный адрес электронной почты');
      }
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
