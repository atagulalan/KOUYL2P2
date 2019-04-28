all = (req, res) => {
  let db = req.globalDatabase;
  res.send(db.get("posts"));
};

category = (req, res) => {
  let db = req.globalDatabase;
  let { categoryid } = req.params;
  res.send(db.get("posts").filter(el => el.category.indexOf(categoryid) > -1));
};

module.exports = {
  list: { all, category }
};
