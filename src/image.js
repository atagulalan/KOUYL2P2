const path = require("path");
const fs = require("fs");

// For security
let items = fs.readdirSync(path.join(__dirname, "../images/"));

get = (req, res) => {
  let image = req.params.imageid;
  if (items.indexOf(image + ".png") > -1) {
    res.sendFile(path.join(__dirname, "../images/" + image + ".png"));
  } else {
    res.send("Image could not found.");
  }
};

/* https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload */
post = (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let date = +new Date();
  req.files.file.mv(
    path.join(__dirname, "../images/" + date + ".png"),
    function(err) {
      if (err) return res.status(500).send(err);

      items = fs.readdirSync(path.join(__dirname, "../images/"));
      res.send(date.toString());
    }
  );
};

module.exports = {
  image: { get, post }
};
