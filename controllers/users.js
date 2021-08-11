require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized');
const InternalServerError = require('../errors/internal-server-error');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const {
  notFoundUserMessage,
  invalidIdMessage,
  serverErrorMessage,
  incorrectDataMessage,
  incorrectEmailOrPasswordMessage,
  emailExistMessage,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'bad-secret-key';

module.exports.getProfileInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUserMessage);
      } else {
        res.send({
          name: user.name,
          email: user.email,
        });
      }
    })
    .catch((e) => {
      let error = e;
      if (!(error.name === 'NotFoundError')) {
        if (e.name === 'CastError') {
          error = new BadRequestError(invalidIdMessage);
        } else {
          error = new InternalServerError(serverErrorMessage);
        }
      }
      next(error);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUserMessage);
      }
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((e) => {
      let error = e;
      if (!(error.name === 'NotFoundError')) {
        if (e.name === 'CastError') {
          error = new BadRequestError(invalidIdMessage);
        } else if (e.name === 'ValidationError') {
          error = new BadRequestError(incorrectDataMessage);
        } else {
          error = new InternalServerError(serverErrorMessage);
        }
      }
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(incorrectEmailOrPasswordMessage);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(incorrectEmailOrPasswordMessage);
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((e) => {
      let error = e;
      if (!(error.name === 'UnauthorizedError')) {
        error = new InternalServerError(serverErrorMessage);
      }

      next(error);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt')
    .end();
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      return User.create(req.body);
    })
    .then((user) => res.send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((e) => {
      let error = e;
      if (e.name === 'ValidationError') {
        error = new BadRequestError(incorrectDataMessage);
      } else if (e.name === 'MongoError') {
        error = new ConflictError(emailExistMessage);
      } else {
        error = new InternalServerError(serverErrorMessage);
      }
      next(error);
    });
};
