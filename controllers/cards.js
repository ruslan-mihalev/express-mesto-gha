const Card = require('../models/card');
const {
  errorBody,
  DEFAULT_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

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
  const {
    name, link, likes = [],
  } = req.body;

  Card.create({
    name, link, owner: req.user._id, likes,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 404 - Карточка с указанным _id не найдена.
// 500 - Ошибка по умолчанию.
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(errorBody(DEFAULT_ERROR_MESSAGE));
    });
};

// 400 - Переданы некорректные данные для постановки/снятии лайка.
// 404 - Передан несуществующий _id карточки.
// 500 - Ошибка по умолчанию.
module.exports.likeCard = (req, res) => {
  console.log(`likeCard cardId: ${req.params.cardId}`);
  Card.findByIdAndUpdate(
    req.params.cardId,
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
  console.log(`unlikeCard cardId: ${req.params.cardId}`);
  Card.findByIdAndUpdate(
    req.params.cardId,
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
