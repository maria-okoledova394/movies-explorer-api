const mongoose = require('mongoose');

const urlRegex = /(http|https):\/\/(www\.)?([a-zA-Z0-9_-]+)\.([a-zA-Z]+)(\/[a-zA-Z0-9_\-._~:/?#[\]@!$&'()*+,;=]*)?/;

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
