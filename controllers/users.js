const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const {
  HttpError, InternalServerError, NotFoundError, BadRequestError, UnauthorizedError, ConflictError,
} = require('../middlewares/errors');

const { isValidObjectId } = require('../utils/validators');

const { SECRET_KEY } = require('../utils/secret');
const { HTTP_CODE_CREATED } = require('../utils/httpCodes');
const {
  WRONG_EMAIL_OR_PASSWORD,
  USER_WITH_EMAIL_ALREADY_EXISTS,
} = require('../utils/errorMessages');

const MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      throw new InternalServerError();
    })
    .catch(next);
};

const getUserById = (userId, res, next) => {
  if (!userId || !isValidObjectId(userId)) {
    next(new BadRequestError());
    return;
  }

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        throw new NotFoundError(`Пользователь по указанному ${userId} не найден.`);
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  return getUserById(userId, res, next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  return getUserById(userId, res, next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res
        .cookie('jwt', token, { maxAge: MILLISECONDS_IN_WEEK, httpOnly: true })
        .send({ email })
        .end();
    })
    .catch((err) => {
      if (err instanceof HttpError) {
        throw err;
      } else {
        throw new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!(email && password)) {
    next(new BadRequestError(WRONG_EMAIL_OR_PASSWORD));
    return;
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(HTTP_CODE_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(USER_WITH_EMAIL_ALREADY_EXISTS);
      } else if (err instanceof ValidationError) {
        throw new BadRequestError(WRONG_EMAIL_OR_PASSWORD);
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { _id: userId } = req.user;
  if (!userId || !isValidObjectId(userId)) {
    next(new BadRequestError());
    return;
  }

  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        throw new NotFoundError();
      } else if (err instanceof ValidationError) {
        throw new BadRequestError();
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { _id: userId } = req.user;
  if (!userId || !isValidObjectId(userId)) {
    next(new BadRequestError());
    return;
  }

  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        throw new NotFoundError();
      } else if (err instanceof ValidationError) {
        throw new BadRequestError();
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};
