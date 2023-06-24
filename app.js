require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const router = require('./routes/routers');
const auth = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');
const { createUserValidation } = require('./middlewares/fieldsValidaton');
const { createUser, login } = require('./controllers/users');

const app = express();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1/mestodb',
} = process.env;
mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', createUserValidation, createUser);
app.post('/signin', createUserValidation, login);

app.use(auth);
app.use(router);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
