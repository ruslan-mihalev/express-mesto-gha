const Card = require('../models/card');
const DEFAULT_SERVER_ERROR = 'Ошибка сервера';

// 500 - Ошибка по умолчанию.
module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => {
      res.send(cards);
    })
    .catch(err => {
      res.status(500).send({ "message": "Ошибка сервера" });
    });
};

// 400 - Переданы некорректные данные при создании карточки.
// 500 - Ошибка по умолчанию.
module.exports.postCard = (req, res) => {
  const { name, link, owner, likes, createdAt } = req.body;

  Card.create({ name, link, owner, likes, createdAt })
    .then(card => {
      res.send(card);
    })
    .catch(err => {
      res.status(500).send({ "message": DEFAULT_SERVER_ERROR });
    });
};

// 404 - Карточка с указанным _id не найдена.
// 500 - Ошибка по умолчанию.
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then( card => res.send(card))
    .catch(err => {
      res.status(500).send({ "message": DEFAULT_SERVER_ERROR });
    });
};

// 400 - Переданы некорректные данные для постановки/снятии лайка.
// 404 - Передан несуществующий _id карточки.
// 500 - Ошибка по умолчанию.
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then(card => res.send(card))
    .catch(err => {
      res.status(500).send({ "message": DEFAULT_SERVER_ERROR });
    });
};

// 400 - Переданы некорректные данные для постановки/снятии лайка.
// 404 - Передан несуществующий _id карточки.
// 500 - Ошибка по умолчанию.
module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then( card => { res.send(card)})
    .catch(err => {
      res.status(500).send({ "message": DEFAULT_SERVER_ERROR });
    })
};