const Card = require("../models/card");
//тест
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../constants/constants");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(SERVER_ERROR).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      () => new Error("Not Found");
    })
    .then((card) => Card.deleteOne(card).then(() => res.send({ card }))) // нашли, удаляем
    .catch(() => {
      res
        .status(NOT_FOUND)
        .send({ message: "Карточка с указанным _id не найдена" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(NOT_FOUND).send({
          message: "Передан несуществующий _id карточки",
          error: err.name,
        });
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка", error: err.name });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError")
        return res
          .status(NOT_FOUND)
          .send({ message: "Передан несуществующий _id карточки" });
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};
