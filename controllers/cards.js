const Card = require('../models/card');
const {
  errorBody,
  DEFAULT_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  BAD_REQUEST_ERROR_MESSAGE,
} = require('../utils/errors');
const { isValidObjectId } = require('../utils/validators');

// 500 - Ошибка по умолчанию.
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      console.log(`err: ${err}`);
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 400 - Переданы некорректные данные при создании карточки.
// 500 - Ошибка по умолчанию.
module.exports.postCard = (req, res) => {
  const { name, link, likes = [] } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
    likes,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      console.log(`err: ${err}`);
      if (err instanceof ValidationError) {
      }
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 404 - Карточка с указанным _id не найдена.
// 500 - Ошибка по умолчанию.
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

  Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(`err: ${err}`);
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 400 - Переданы некорректные данные для постановки/снятии лайка.
// 404 - Передан несуществующий _id карточки.
// 500 - Ошибка по умолчанию.
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(`err: ${err}`);
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 400 - Переданы некорректные данные для постановки/снятии лайка.
// 404 - Передан несуществующий _id карточки.
// 500 - Ошибка по умолчанию.
module.exports.unlikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send(errorBody(BAD_REQUEST_ERROR_MESSAGE));
    return;
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      console.log(`err: ${err}`);
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};
