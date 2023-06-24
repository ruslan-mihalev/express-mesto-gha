const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');
const { SECRET_KEY } = require('../utils/secret');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      req.user = jwt.verify(token, SECRET_KEY);
      next();
    } catch (err) {
      next(new UnauthorizedError());
    }
  } else {
    next(new UnauthorizedError());
  }
};
