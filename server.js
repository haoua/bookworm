var express = require('express'),
    livres = require('./routes/book');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/livre', livres.findAll);
app.get('/livre/:id', livres.findById);
app.post('/livre', livres.addBook);
app.put('/livre/:id', livres.updateBook);
app.delete('/livre/:id', livres .deleteBook);

app.listen(3000);
console.log('Listening on port 3000...');

