list = (req,res) => {
  let db = req.globalDatabase;
  res.send(db.get('posts'));
}

module.exports = {
  list
}