const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/routers');
const { NOT_FOUND } = require('./utils/responses');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1/mestodb',
} = process.env;
mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());
app.use((req, res) => {
  res.status(NOT_FOUND).send(req);
});

app.use((req, res, next) => {
  req.user = {
    _id: '6475ca24b169212a8b667885',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
