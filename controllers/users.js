const mongoose = require("mongoose");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../constants/constants");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() =>
      res.status(SERVER_ERROR).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res) => {
  if (mongoose.isValidObjectId(req.params.userId)) {
    User.findById(req.params.userId)
      .orFail(() => {
        new Error();
      })
      .then((user) => res.json(user))
      .catch((err) => {
        if (err.name === "DocumentNotFoundError")
          return res.status(NOT_FOUND).send({
            message: "Пользователь по указанному _id не найден",
          });
        return res
          .status(SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка", error: err.name });
      });
  } else {
    return res.status(BAD_REQUEST).send({
      message: "Переданы некорректные данные",
    });
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      if (err.name === "CastError")
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      if (err.name === "CastError")
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};
