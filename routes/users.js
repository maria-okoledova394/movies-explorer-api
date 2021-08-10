const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  getProfileInfo,
} = require('../controllers/users');

router.get('/me', getProfileInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).label('Некорректные введенные данные'),
    email: Joi.string().required().label('Некорректные введенные данные'),
  }),
}), updateProfile);

module.exports = router;
