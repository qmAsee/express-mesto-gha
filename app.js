const express = require('express');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const router = require('./routes/routers');
const { NOT_FOUND } = require('./utils/responses');
const { createUser, login } = require('./controllers/users');

const linkPattern = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1/mestodb',
} = process.env;
mongoose.connect(MONGO_URL);

const app = express();
app.use(helmet());
app.use(express.json());

app.use(router);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/', router.all('*', (req, res) => {
  res.status(NOT_FOUND).send({
    message: 'Запрашиваемый ресурс не найден',
  });
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
