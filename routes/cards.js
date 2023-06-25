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
const { IMAGE_URL_REGEX } = require('../utils/validators');

router.get('/', getCards);
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(IMAGE_URL_REGEX),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

module.exports = router;
