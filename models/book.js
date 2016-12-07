var mongoose    = require('mongoose');

exports.BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String
});

exports.Book = mongoose.model('Book', exports.BookSchema);