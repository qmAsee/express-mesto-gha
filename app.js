const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const NotFound = require('./utils/errorClasses/ErrorNotFound');
const router = require('./routes/routers');
const { NOT_FOUND } = require('./utils/responses');
const auth = require('./middlewares/auth');

const app = express();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1/mestodb',
} = process.env;
mongoose.connect(MONGO_URL);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(auth);
app.use(errors());

app.use((req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

app.use('/', router.all('*', (req, res) => {
  res.status(NOT_FOUND).send({
    message: 'Запрашиваемый ресурс не найден',
  });
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
