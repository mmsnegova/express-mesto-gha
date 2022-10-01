const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
    return;
  }

  req.user = payload;
  next();
};
