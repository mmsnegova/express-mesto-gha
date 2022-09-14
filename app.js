const express = require("express");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const { NOT_FOUND } = require("./constants/constants");

const app = express();
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "631e442ee585150bf2ed4a84",
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", routerUsers);
app.use("/cards", routerCards);
app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Страница не найдена" })
);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
