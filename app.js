require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
// const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, URL } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// app.use(cors);
app.use(cookieParser());

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Такого адреса не существует'));
});

app.use(errors());

app.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
