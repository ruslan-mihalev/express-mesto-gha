const {
  celebrate, Joi, Segments,
} = require('celebrate');
const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');
const { IMAGE_URL_REGEX, createObjectIdValidator } = require('../utils/validators');

router.get('/', getCards);
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(IMAGE_URL_REGEX),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().custom(createObjectIdValidator('cardId')),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().custom(createObjectIdValidator('cardId')),
  }),
}), likeCard);
router.delete('/:cardId/likes,', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().custom(createObjectIdValidator('cardId')),
  }),
}), unlikeCard);

module.exports = router;
