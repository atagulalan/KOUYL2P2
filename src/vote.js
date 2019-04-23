vote = (req,res) => {
  let db = req.globalDatabase;
  let {slug, diff} = req.body;
  diff = diff >= 1 ? 1 : diff <= -1 ? -1 : 0;
  if ( diff!==0 && slug && db.get('posts').find({ slug }).value()) {
    console.log("slug yollandı ve var", slug)
    db.get('posts').find({ slug }).update('stats.like', n => n + diff).write();
  } 
  res.send("success");
}

module.exports = {
  vote
}