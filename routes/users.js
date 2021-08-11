const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  getProfileInfo,
} = require('../controllers/users');
const { incorrectDataMessage } = require('../utils/constants');

router.get('/me', getProfileInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).label(incorrectDataMessage),
    email: Joi.string().required().label(incorrectDataMessage),
  }),
}), updateProfile);

module.exports = router;
