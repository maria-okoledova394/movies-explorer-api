const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-error');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');
const {
  invalidIdMessage,
  serverErrorMessage,
  incorrectDataMessage,
  notAllowDeleteMessage,
  notFoundMovieMessage,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(() => {
      const error = new InternalServerError(serverErrorMessage);
      next(error);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    owner,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      thumbnail: movie.thumbnail,
      owner: movie.owner,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      movieId: movie.movieId,
    }))
    .catch((e) => {
      let error = e;
      if (e.name === 'ValidationError') {
        error = new BadRequestError(incorrectDataMessage);
      } else {
        error = new InternalServerError(serverErrorMessage);
      }
      next(error);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundMovieMessage);
      } else if (req.user._id === movie.owner.toString()) {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => {
            res.send({
              country: deletedMovie.country,
              director: deletedMovie.director,
              duration: deletedMovie.duration,
              year: deletedMovie.year,
              description: deletedMovie.description,
              image: deletedMovie.image,
              trailer: deletedMovie.trailer,
              thumbnail: deletedMovie.thumbnail,
              owner: deletedMovie.owner,
              movieId: deletedMovie.movieId,
              _id: deletedMovie._id,
              nameRU: deletedMovie.nameRU,
              nameEN: deletedMovie.nameEN,
            });
          });
      } else {
        throw new ForbiddenError(notAllowDeleteMessage);
      }
    })
    .catch((e) => {
      let error = e;
      if (!(error.name === 'NotFoundError')) {
        if (!(error.name === 'ForbiddenError')) {
          if (e.name === 'CastError') {
            error = new BadRequestError(invalidIdMessage);
          } else {
            error = new InternalServerError(serverErrorMessage);
          }
        }
      }
      next(error);
    });
};
