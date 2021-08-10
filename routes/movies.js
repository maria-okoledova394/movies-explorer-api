const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/cards');

const BadRequestError = require('../errors/bad-request');

const method = (value) => {
  const result = validator.isURL(value, {
    require_protocol: true,
  });
  if (result) {
    return value;
  }
  throw new BadRequestError('Некорректные введенные данные');
};

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .label('Некорректные введенные данные'),
    link: Joi.string().required().custom(method).label('Некорректные введенные данные'),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).label('Невалидный id'),
  }),
}), deleteMovie);

module.exports = router;
