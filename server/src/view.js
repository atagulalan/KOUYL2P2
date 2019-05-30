view = (req, res) => {
  let db = req.globalDatabase;
  let { slug } = req.params;
  if (
    slug &&
    db
      .get("posts")
      .find({ slug })
      .value()
  ) {
    db.get("posts")
      .find({ slug })
      .update("stats.views", n => n + 1)
      .write();
    res.send(
      db
        .get("posts")
        .find({ slug })
        .value()
    );
  } else {
    res.send({
      slug: "",
      title: "",
      image: "",
      content: "",
      category: [],
      date: null,
      stats: { like: 0, dislike: 0, views: 0 }
    });
  }
};

module.exports = {
  view
};
