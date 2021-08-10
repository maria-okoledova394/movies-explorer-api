const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-error');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(() => {
      const error = new InternalServerError('На сервере произошла ошибка');
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
    thumbnail,
    nameRU,
    nameEN,
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
    thumbnail,
    owner,
    nameRU,
    nameEN,
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
      movieId: movie._id,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
    }))
    .catch((e) => {
      let error = e;
      if (e.name === 'ValidationError') {
        error = new BadRequestError('Некорректные введенные данные');
      } else {
        error = new InternalServerError('На сервере произошла ошибка');
      }
      next(error);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
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
              movieId: deletedMovie._id,
              nameRU: deletedMovie.nameRU,
              nameEN: deletedMovie.nameEN,
            });
          });
      } else {
        throw new ForbiddenError('Удалять можно только свои карточки');
      }
    })
    .catch((e) => {
      let error = e;
      if (!(error.name === 'NotFoundError')) {
        if (!(error.name === 'ForbiddenError')) {
          if (e.name === 'CastError') {
            error = new BadRequestError('Невалидный id');
          } else {
            error = new InternalServerError('На сервере произошла ошибка');
          }
        }
      }
      next(error);
    });
};
/*
module.exports.likeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      } else {
        res.send({
          name: movie.name,
          link: movie.link,
          owner: movie.owner,
          _id: movie._id,
          createdAt: movie.createdAt,
          likes: movie.likes,
        });
      }
    })
    .catch((e) => {
      let error = e;
      if (!(error.name === 'NotFoundError')) {
        if (e.name === 'CastError') {
          error = new BadRequestError('Невалидный id');
        } else {
          error = new InternalServerError('На сервере произошла ошибка');
        }
      }
      next(error);
    });
};

module.exports.dislikeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      } else {
        res.send({
          name: movie.name,
          link: movie.link,
          owner: movie.owner,
          _id: movie._id,
          createdAt: movie.createdAt,
          likes: movie.likes,
        });
      }
    })
    .catch((e) => {
      let error = e;
      if (!(error.name === 'NotFoundError')) {
        if (e.name === 'CastError') {
          error = new BadRequestError('Невалидный id');
        } else {
          error = new InternalServerError('На сервере произошла ошибка');
        }
      }
      next(error);
    });
}; */
