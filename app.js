require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const cors = require('./middlewares/cors');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const auth = require('./middlewares/auth');
const { createUser, login, logout } = require('./controllers/users');
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

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signout', logout);

app.use('/users', auth, usersRoutes);
app.use('/movies', auth, moviesRoutes);

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
