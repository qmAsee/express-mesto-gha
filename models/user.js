const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isUrl(v),
      message: 'Укажите URL-адрес изображения',
    },
  },
  email: {
    required: true,
    unique: true,
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Почта введена неверно',
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
