const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new NotFoundError('Передан несуществующий id карточки');
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) throw new ForbiddenError('Нельзя удалить чужую карточку');
      Card.deleteOne(card).then(() => res.send({ card })); // нашли, удаляем
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) throw new NotFoundError('Передан несуществующий id карточки');
    return res.send({ card });
  }).catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) throw new NotFoundError('Передан несуществующий id карточки');
    return res.send({ card });
  }).catch(next);
};
