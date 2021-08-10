const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  getProfileInfo,
} = require('../controllers/users');

router.get('/users/me', getProfileInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).label('Некорректные введенные данные'),
    about: Joi.string().min(2).max(30).label('Некорректные введенные данные'),
  }),
}), updateProfile);

module.exports = router;
