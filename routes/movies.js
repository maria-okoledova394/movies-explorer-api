const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { incorrectDataMessage, invalidIdMessage } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request');

const method = (value) => {
  const result = validator.isURL(value, {
    require_protocol: true,
  });
  if (result) {
    return value;
  }
  throw new BadRequestError(incorrectDataMessage);
};

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().label('Некорректные введенные данные страны'),
    director: Joi.string().required().label('Некорректные введенные данные директора'),
    duration: Joi.number().required().label('Некорректные введенные данные длительности'),
    year: Joi.string().required().label('Некорректные введенные данные года'),
    description: Joi.string().required().label('Некорректные введенные данные описания'),
    image: Joi.string().required().custom(method).label('Некорректные введенные данные изображения'),
    trailer: Joi.string().required().custom(method).label('Некорректные введенные данные трейлера'),
    nameRU: Joi.string().required().label('Некорректные введенные данные названия'),
    nameEN: Joi.string().required().label('Некорректные введенные данные названия'),
    thumbnail: Joi.string().required().custom(method).label('Некорректные введенные данные миниатюры'),
    movieId: Joi.number().required().label('Некорректные введенные данные id фильма'),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).label(invalidIdMessage),
  }),
}), deleteMovie);

module.exports = router;
