const Card = require('../models/card');

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../constants/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        res.status(401).send({ message: 'Недостаточно прав' });
        return;
      }
      Card.deleteOne(card).then(() => res.send({ card })); // нашли, удаляем
    }).catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
      }
      return res
        .status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => {
    throw new Error('NotFound');
  }).then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      }
      return res
        .status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new Error('NotFound');
  }).then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      }
      return res
        .status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
