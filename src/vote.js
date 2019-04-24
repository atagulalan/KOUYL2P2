vote = (req,res) => {
  let db = req.globalDatabase;
  let {slug, userid, diff} = req.body;
  diff = diff >= 1 ? 1 : diff <= -1 ? -1 : 0;

  if(!userid){
    res.send("userid not defined");
    return false;
  }

  if(!slug){
    res.send("slug not defined");
    return false;
  }
  
  //prepare post
  if (!db.get('votes').find({ slug }).value() && db.get('posts').find({ slug }).value()) {
    db.get('votes').push({ slug: slug, voteCount:0, votes: []}).write();
  }

  let votes = db.get('votes')
                .find({ slug })
                .get('votes')
                .value();

  let relativediff = diff;

  if(db.get('votes').find({ slug }).get('votes').find({userid}).value()){
    let indx = votes.findIndex(e => e.userid === userid);
    let oldDif = votes[indx].diff;
    relativediff -= oldDif;
    votes[indx] = {
      userid, diff
    }
  }else{
    votes.push({ userid, diff });
  }

  db.get('votes')
    .find({ slug })
    .assign({ votes })
    .update('voteCount', n => n + relativediff)
    .write();

  res.send(votes);
}

module.exports = {
  vote
}