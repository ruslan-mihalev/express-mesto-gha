const { ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const {
  errorBody,
  BAD_REQUEST,
  BAD_REQUEST_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_MESSAGE,
} = require('../utils/errors');
const { isValidObjectId } = require('../utils/validators');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(404)
          .send(
            errorBody(
              `Пользователь по указанному ${req.params.userId} не найден.`,
            ),
          );
      }
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  if (!userId || !isValidObjectId(userId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND_ERROR).send(errorBody(NOT_FOUND_ERROR_MESSAGE));
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  if (!userId || !isValidObjectId(userId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND_ERROR).send(errorBody(NOT_FOUND_ERROR_MESSAGE));
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    });
};
