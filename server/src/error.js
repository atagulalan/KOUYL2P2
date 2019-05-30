error = (req, res) => {
  res.status(404).send("error");
};

module.exports = {
  error
};
