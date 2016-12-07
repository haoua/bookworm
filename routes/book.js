var BookModel   = require('../models/book');
var CollectionModel   = require('../models/collection');

exports.seeAll = function(req, res) {
  BookModel.Book.find({}, function(err, books) {
    res.json(books);
  });
}

exports.addBook = function(req, res) {
	console.log(req.body);
	var newBook = new BookModel.Book({title: req.body.title, isbn:req.body.isbn});
	newBook.save(function(err){
		if(err){
			console.log(err);
		}else{
			console.log(newBook);
			if (req.body.inColl == 1) {
				console.log("Le livre est dans la collection");
				CollectionModel.Collection.findOne({
					title: req.body.collection
				}, function(err, collection) {
					if (!collection){
						console.log("Il va falloir créer la collection")
						var newCollection = new CollectionModel.Collection({title: req.body.collection, books: [newBook._id]});
						newCollection.save();
						console.log(newCollection);
					}else{
						var BookInCollection = newBook._id;

						CollectionModel.Collection.findByIdAndUpdate(
						    collection._id,
						    {$push: {books: newBook._id}},
						    {safe: true, upsert: true},
						    function(err, model) {
						        console.log(err);
						    }
						);
					}
				});
			}
		}
	});
}

exports.seeSingle = function(req, res) {
var id = req.params.id;
  BookModel.Book.find({_id : id }, function(err, book) {
    res.json(book);
  });
}