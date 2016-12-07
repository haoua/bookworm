var mongoose    = require('mongoose');

exports.UserSchema = new mongoose.Schema({
  username: String,
  pass: String,
  admin: Boolean,
  unread: [{}],
  read: [{}]
});

exports.User = mongoose.model('User', exports.UserSchema);