add = (req, res) => {
  let db = req.globalDatabase;
  let { title, content, slug, category, image, token, date } = req.body;
  let localDate = +new Date();

  if (
    token &&
    db
      .get("users")
      .find({ token })
      .value().token
  ) {
    if (
      slug &&
      db.get("posts")
        .find({ slug })
        .value()
    ) {
      console.log("slug yollandı ve var", slug);
      db.get("posts")
        .find({ slug })
        .assign({ title, content, image, category, date })
        .write();
    } else {
      console.log("yeni olusturuluyor");
      db.get("posts")
        .push({
          slug: localDate.toString(),
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
        })
        .write();
    }

    res.send(localDate.toString());
  } else {
    res.send("not authorized");
  }
};

remove = (req, res) => {
  let db = req.globalDatabase;
  let { slug, token } = req.body;

  if (
    token &&
    db
      .get("users")
      .find({ token })
      .value().token
  ) {
    db.get("posts")
      .remove({ slug })
      .write();
    res.send("success");
  } else {
    res.send("not authorized");
  }
};

module.exports = {
  admin: { add, remove }
};
