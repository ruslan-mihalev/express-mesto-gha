const {
  celebrate, Joi, Segments,
} = require('celebrate');
const router = require('express').Router();
const {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { IMAGE_URL_REGEX, createObjectIdValidator } = require('../utils/validators');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().custom(createObjectIdValidator('userId')),
  }),
}), getUserById);
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().regex(IMAGE_URL_REGEX),
  }),
}), updateAvatar);

module.exports = router;
