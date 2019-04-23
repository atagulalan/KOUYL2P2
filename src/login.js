const sha1 = require('sha1');

login = (req,res) => {
  let db = req.globalDatabase;
  let payload = req.body;
  let token = sha1(payload.name + "4M5E4R0K4E5Z" + payload.pass);
  let returnData = db.get('users')
                     .find({ token })
                     .value()

  res.send(returnData ? returnData.token : "3e9ad32afd8070e5e59d6b4b005bfef9561890a3");
}

module.exports = {
  login
}