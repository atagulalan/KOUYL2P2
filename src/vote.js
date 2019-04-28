vote = (req, res) => {
  let db = req.globalDatabase;
  let { slug, userid, diff } = req.body;
  diff = diff >= 1 ? 1 : diff <= -1 ? -1 : 0;

  if (!userid) {
    res.send("userid not defined");
    return false;
  }

  if (!slug) {
    res.send("slug not defined");
    return false;
  }

  if (
    !db
      .get("posts")
      .find({ slug })
      .value()
  ) {
    res.send("no posts found by that slug");
    return false;
  }

  //prepare post
  if (
    !db
      .get("votes")
      .find({ slug })
      .value()
  ) {
    db.get("votes")
      .push({ slug: slug, voteCount: 0, votes: [] })
      .write();
  }

  let votes = db
    .get("votes")
    .find({ slug })
    .get("votes")
    .value();

  let relativediff = diff;

  if (
    db
      .get("votes")
      .find({ slug })
      .get("votes")
      .find({ userid })
      .value()
  ) {
    let indx = votes.findIndex(e => e.userid === userid);
    let oldDif = votes[indx].diff;
    relativediff -= oldDif;
    votes[indx] = {
      userid,
      diff
    };
  } else {
    votes.push({ userid, diff });
  }

  db.get("votes")
    .find({ slug })
    .assign({ votes })
    .update("voteCount", n => n + relativediff)
    .write();

  let likeDiff =
    (relativediff === -1 && diff === 0) || relativediff === -2
      ? -1
      : (relativediff === 1 && diff !== 0) || relativediff === +2
      ? +1
      : 0;
  let dislikeDiff =
    (relativediff === -1 && diff !== 0) || relativediff === -2
      ? +1
      : (relativediff === 1 && diff === 0) || relativediff === +2
      ? -1
      : 0;

  db.get("posts")
    .find({ slug })
    .update("stats.like", n => n + likeDiff)
    .update("stats.dislike", n => n + dislikeDiff)
    .write();

  res.send(
    db
      .get("posts")
      .find({ slug })
      .get("stats")
      .value()
  );
};

module.exports = {
  vote
};
