const BAD_REQUEST = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

const DEFAULT_ERROR_MESSAGE = 'Ошибка сервера';
const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные';

const errorBody = (msg) => ({
  message: msg,
});

module.exports = {
  BAD_REQUEST,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
  BAD_REQUEST_ERROR_MESSAGE,
  errorBody,
};
