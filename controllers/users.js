const User = require('../models/user');
const {
  errorBody,
  DEFAULT_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

// 500 - Ошибка по умолчанию.
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 404 - Пользователь по указанному _id не найден.
// 500 - Ошибка по умолчанию.
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
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
    .catch((err) => {
      //console.log(err);
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 400 - Переданы некорректные данные при создании пользователя.
// 500 - Ошибка по умолчанию.
module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 400 - Переданы некорректные данные при обновлении профиля.
// 404 - Пользователь с указанным _id не найден.
// 500 - Ошибка по умолчанию.
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 400 - Переданы некорректные данные при обновлении аватара.
// 404 - Пользователь с указанным _id не найден.
// 500 - Ошибка по умолчанию.
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};
