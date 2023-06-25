require('dotenv').config();

const {
  celebrate, errors, Joi, Segments,
} = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { errorsHandler } = require('./middlewares/errors');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const { IMAGE_URL_REGEX } = require('./utils/validators');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(IMAGE_URL_REGEX),
  }),
}), createUser);
app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use(cookieParser());
app.use(auth);
app.use(router);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server on port ${PORT} started...`);
  /* eslint-enable no-console */
});
