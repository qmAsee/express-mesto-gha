const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const router = require('./routes/routers');
const { NOT_FOUND } = require('./utils/responses');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1/mestodb',
} = process.env;
mongoose.connect(MONGO_URL);

const app = express();
app.use(helmet());
app.use(express.json());

app.use(router);
app.use('/', router.all('*', (req, res) => {
  res.status(NOT_FOUND).send({
    message: 'Запрашиваемый ресурс не найден',
  });
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
