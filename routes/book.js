var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('bookdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'bookdb' database");
        db.collection('books', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'books' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    var o_id = new mongo.ObjectID(id);
    console.log(o_id);
    console.log('Retrieving book: ' + id);
    db.collection('books', function(err, collection) {
        collection.findOne({'_id':o_id}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('books', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addBook = function(req, res) {
    var book = req.body;
    console.log('Adding books: ' + JSON.stringify(book));
    db.collection('books', function(err, collection) {
        collection.insert(book, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateBook = function(req, res) {
    var id = req.params.id;
    var book = req.body;
    var o_id = new mongo.ObjectID(id);
    console.log('Updating book: ' + id);
    console.log(JSON.stringify(book));
    db.collection('books', function(err, collection) {
        collection.update({'_id':o_id}, book, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating book: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(book);
            }
        });
    });
}

exports.deleteBook = function(req, res) {
    var id = req.params.id;
    var o_id = new mongo.ObjectID(id);
    console.log('Deleting book: ' + id);
    db.collection('books', function(err, collection) {
        collection.remove({'_id':o_id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var populateDB = function() {

    var books = [
        {
            name: "Livre1",
            year: "2009"
        },
        {
            name: "Livre2",
            year: "2006"
        }];

    db.collection('books', function(err, collection) {
        collection.insert(books, {safe:true}, function(err, result) {});
    });

};
