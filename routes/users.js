const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  updateProfile,
  getProfileInfo,
} = require('../controllers/users');
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

router.get('/me', getProfileInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).label('Некорректные введенные данные'),
    email: Joi.string().required().custom(method).label('Некорректные введенные данные'),
  }),
}), updateProfile);

module.exports = router;
