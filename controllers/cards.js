const { CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const {
  errorBody,
  BAD_REQUEST,
  BAD_REQUEST_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_MESSAGE,
} = require('../utils/errors');
const { isValidObjectId } = require('../utils/validators');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

  Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(NOT_FOUND_ERROR).send(errorBody(NOT_FOUND_ERROR_MESSAGE));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

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
      if (err instanceof CastError) {
        res.status(NOT_FOUND_ERROR).send(errorBody(NOT_FOUND_ERROR_MESSAGE));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    });
};

module.exports.unlikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

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
      if (err instanceof CastError) {
        res.status(NOT_FOUND_ERROR).send(errorBody(NOT_FOUND_ERROR_MESSAGE));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(errorBody(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    });
};
