const BAD_REQUEST = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Ошибка сервера';

const MONGO_VALIDATION_ERROR_NAME = 'ValidationError';

const errorBody = (msg) => ({
  message: msg,
});

module.exports = {
  errorBody,
  BAD_REQUEST,
  BAD_REQUEST_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_ERROR,
  MONGO_VALIDATION_ERROR_NAME,
};
