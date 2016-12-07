var mongoose    = require('mongoose');

exports.CollectionSchema = new mongoose.Schema({
  title: String,
  books: Array
});

exports.Collection = mongoose.model('Collection', exports.CollectionSchema);