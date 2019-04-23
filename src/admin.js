add = (req,res) => {
  let db = req.globalDatabase;
  let {title, content, slug, category, image, token} = req.body;
  let date = (+ new Date());

  if(req.body.token && db.get('users').find({ token: req.body.token }).value().token){
    
    if ( slug && db.get('posts').find({ slug }).value()) {
      console.log("slug yollandı ve var", slug)
      db.get('posts').find({ slug }).assign(
        { title, content, image, category }
      ).write();
    } else {
      console.log("yeni olusturuluyor")
      db.get('posts').push(
        {
          slug: date.toString(),
          title,
          image,
          content,
          category,
          date,
          stats: {
            like: 0,
            dislike: 0,
            views: 0
          }
        }
      ).write()
    }
    
    res.send(date.toString())

  } else {
    res.send("not authorized")
  }
}

remove = (req,res) => {
  let db = req.globalDatabase;
  let { slug, token } = req.body;
  
  if(req.body.token && db.get('users').find({ token: req.body.token }).value().token){
    db.get('posts')
    .remove({ slug })
    .write()
    res.send("success")
  }else{
    res.send("not authorized")
  }  
}

module.exports = {
  admin: {add, remove}
}