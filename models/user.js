const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { BadRequestError, UnauthorizedError } = require('../middlewares/errors');
const { WRONG_EMAIL_OR_PASSWORD } = require('../utils/errorMessages');
const { IMAGE_URL_REGEX } = require('../utils/validators');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return IMAGE_URL_REGEX.test(link);
      },
      message: 'Неправильный формат ссылки',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  if (!(email && validator.isEmail(email) && password)) {
    return Promise.reject(new BadRequestError(WRONG_EMAIL_OR_PASSWORD));
  }

  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
