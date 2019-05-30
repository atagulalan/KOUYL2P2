const { login } = require("./login");
const { admin } = require("./admin");
const { error } = require("./error");
const { vote } = require("./vote");
const { view } = require("./view");
const { image } = require("./image");
const { list } = require("./list");

module.exports = {
  login,
  admin,
  error,
  vote,
  view,
  image,
  list,
  category
};
