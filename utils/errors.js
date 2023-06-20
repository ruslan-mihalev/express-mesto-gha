const DEFAULT_SERVER_ERROR = 'Ошибка сервера';

const errorBody = (msg) => ({
  'message': msg
});

module.exports = {
  DEFAULT_SERVER_ERROR,
  errorBody
}
