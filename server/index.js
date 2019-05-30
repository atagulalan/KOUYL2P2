const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const { login, admin, error, vote, view, image, list } = require("./src");
const app = express();
const port = 4540;

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("database/db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [], posts: [], votes: [] }).write();

// Parse JSON from body of the request
app.use(express.json());
app.use(fileUpload());

// Adding memory database reference as request key
app.use(function(req, res, next) {
  req.globalDatabase = db;
  next();
});

// Public Folder
app.use(express.static(path.join(__dirname, "./public")));

//Direct Access
app.post("/login", login);

app.post("/admin/add", admin.add);
app.post("/admin/remove", admin.remove);

app.post("/vote", vote);

app.get("/view/:slug", view);

app.post("/image", image.post);
app.get("/image/:imageid", image.get);

app.get("/list", list.all);
app.get("/list/:categoryid", list.category);

app.get("/404", error);

//Redirect to 404
app.use(function(req, res) {
  res.redirect("/404");
});

// Listen to your commender
app.listen(port, () => console.log(`Listening, commender! ${port}`));
