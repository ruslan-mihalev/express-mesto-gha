const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_FORBIDDEN,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_CONFLICT,
  HTTP_CODE_INTERNAL_SERVER_ERROR,
} = require('../utils/httpCodes');

class HttpError extends Error {
  constructor(name, message, statusCode) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

/**
 * 400 - переданы некорректные данные в методы
 * создания карточки, пользователя, обновления аватара пользователя или профиля
 */
class BadRequestError extends HttpError {
  constructor(message = 'Переданы некорректные данные') {
    super('BadRequestError', message, HTTP_CODE_BAD_REQUEST);
  }
}

/**
 * 401 - передан неверный логин или пароль.
 * Также эту ошибку возвращает авторизационный middleware, если передан неверный JWT
 */
class UnauthorizedError extends HttpError {
  constructor(message = 'Ошибка аутентификации') {
    super('UnauthorizedError', message, HTTP_CODE_UNAUTHORIZED);
  }
}

/**
 * 403 - попытка удалить чужую карточку
 */
class ForbiddenError extends HttpError {
  constructor(message = 'Отказано в доступе') {
    super('ForbiddenError', message, HTTP_CODE_FORBIDDEN);
  }
}

/**
 * 404 - карточка или пользователь не найден или был запрошен несуществующий роут
 */
class NotFoundError extends HttpError {
  constructor(message = 'Объект не найден') {
    super('NotFoundError', message, HTTP_CODE_NOT_FOUND);
  }
}

/**
 * 409 - при регистрации указан email, который уже существует на сервере
 */
class ConflictError extends HttpError {
  constructor(message = 'Объект уже существует') {
    super('ConflictError', message, HTTP_CODE_CONFLICT);
  }
}

/**
 * 500 - ошибка по умолчанию. Сопровождается сообщением: «На сервере произошла ошибка»
 */
class InternalServerError extends HttpError {
  constructor(message = 'На сервере произошла ошибка') {
    super('InternalServerError', message, HTTP_CODE_INTERNAL_SERVER_ERROR);
  }
}

const errorsHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let httpError;
  if (!err || !(err instanceof HttpError)) {
    httpError = new InternalServerError();
  } else {
    httpError = err;
  }

  res.status(httpError.statusCode).send({ message: httpError.message });
};

module.exports = {
  errorsHandler,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
