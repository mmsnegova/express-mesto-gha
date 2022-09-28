const validator = require('validator');
const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!validator.isEmail(email)) {
    res.status(BAD_REQUEST).send({
      message: 'Передан невалидный email',
    });
    return;
  }
  User.create({
    name,
    about,
    avatar,
    email,
    password,
  })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).then((user) => {
    if (!user) throw new Error('NotFound');
    return res.json(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Невалидный id',
        });
      }
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).then((user) => {
    if (!user) throw new Error('NotFound');
    return res.json(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Невалидный id',
        });
      }
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
