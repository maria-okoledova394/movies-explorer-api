const allowedCors = [
  'https://movies.box.nomoredomains.club',
  'http://movies.box.nomoredomains.club',
  'localhost:3000',
  'http://84.201.174.27',
  'https://84.201.174.27',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.status(200).send();
    return;
  }

  next();
};
