const sha1 = require("sha1");

login = (req, res) => {
  let db = req.globalDatabase;
  let payload = req.body;
  let token = sha1(payload.name + "4M5E4R0K4E5Z" + payload.pass);
  let user = db
    .get("users")
    .find({ token })
    .value();

  let returnData = user
    ? {
        restKey: "Basic ZjdlMTIxNzctN2FkMS00ZGE5LTgzNDItNTEyY2Y0Njc4ZWY1",
        appKey: "7d5f91ae-d848-475e-b3cc-470d3f2b9fcc",
        token: user.token
      }
    : '{"restKey":"","appKey":"","token":"3e9ad32afd8070e5e59d6b4b005bfef9561890a3"}';

  res.send(returnData);
};

module.exports = {
  login
};
