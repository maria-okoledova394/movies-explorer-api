require('dotenv').config();
const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/forbidden');
const UnauthorizedError = require('../errors/unauthorized');
const { needAuthMessage, authErrorMessage } = require('../utils/constants');

const extractBearerToken = (header) => header.replace('Bearer ', '');
const { NODE_ENV, JWT_SECRET } = process.env;
const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'bad-secret-key';

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new ForbiddenError(needAuthMessage));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
    req.user = payload;

    next();
  } catch (e) {
    next(new UnauthorizedError(authErrorMessage));
  }
};
