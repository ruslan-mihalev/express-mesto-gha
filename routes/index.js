const router = require('express').Router();
const {
  NOT_FOUND_ERROR,
  errorBody,
  NOT_FOUND_ERROR_MESSAGE,
} = require('../middlewares/errors');

router.use('/cards', require('./cards'));
router.use('/users', require('./users'));

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send(errorBody(NOT_FOUND_ERROR_MESSAGE));
});

module.exports = router;
