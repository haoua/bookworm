var UserModel   = require('../models/user');

exports.addUser = function(req, res) {
  var newUser = new UserModel.User({username: req.body.username, pass: req.body.pass});
  newUser.save(function(err){
    if(err)
      console.log(err);
    else
      console.log(newUser);
  });
}

exports.seeSingle = function(req, res) {
var id = req.params.id;
  UserModel.User.find({_id : id }, function(err, users) {
    res.json(users);
  });
}

exports.editUser = function(req, res) {
  var id = req.params.id;
  var mdp = req.body.pass;
  if (mdp !="") {  
    UserModel.User.findOne({_id: id}, function (err, user) {
        user.pass = mdp;

        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
    });
  }
}