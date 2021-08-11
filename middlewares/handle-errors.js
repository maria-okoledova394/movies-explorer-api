module.exports = (err, req, res, next) => { // eslint-disable-line
  res.status(err.statusCode).send({ message: err.message });
};
