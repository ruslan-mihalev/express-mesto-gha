const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const {
  HttpError, InternalServerError, BadRequestError, NotFoundError, ForbiddenError,
} = require('../middlewares/errors');
const { HTTP_CODE_CREATED } = require('../utils/httpCodes');
const { ATTEMPT_TO_DELETE_CARD_FOR_ANOTHER_USER } = require('../utils/errorMessages');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      throw new InternalServerError();
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(HTTP_CODE_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        throw new BadRequestError();
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => {
      const { owner: { _id: ownerId } } = card;
      if (ownerId.equals(userId)) {
        return card.deleteOne();
      }

      throw new ForbiddenError(ATTEMPT_TO_DELETE_CARD_FOR_ANOTHER_USER);
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        throw new NotFoundError();
      } else if (err instanceof HttpError) {
        throw err;
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        throw new NotFoundError();
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};

module.exports.unlikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        throw new NotFoundError();
      } else {
        throw new InternalServerError();
      }
    })
    .catch(next);
};
