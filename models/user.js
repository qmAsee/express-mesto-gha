const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    required: true,
    type:  String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    required: true,
    type: String,
    default: 'https://avatarko.ru/img/kartinka/1/Crazy_Frog.jpg'
  },
})

module.exports = mongoose.model('user', userSchema)