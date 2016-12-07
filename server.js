// REQUIRE MODULES
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan'); // a supprimer
var jwt    		= require('jsonwebtoken'); 
var mongoose    = require('mongoose');

// REQUIRE FILE
var config = require('./config');
var UserModel   = require('./models/user');
var BookModel   = require('./models/book');

// DEFINE APP
var app         = express();


var apiRoutes 	= express.Router(); 
var UserRoutes   = require('./routes/user');
var BookRoutes   = require('./routes/book');
 

// DB
mongoose.connect(config.database); // connect to database

// TOKEN
app.set('key', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));


// ROUTES
// Ajouter un utilisateur (inscription, donc pas de token)
app.post("/users", UserRoutes.addUser);

app.get('/books', BookRoutes.seeAll);


// Identifier un utilisateur, lui attribuer un token
apiRoutes.post('/connect', function(req, res) {
  // find the user
  UserModel.User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: "L'utilisateur n'existe pas" });
    } else if (user) {

      // check if password matches
      if (user.pass != req.body.pass) {
        res.json({ success: false, message: "Le mot de passe que vous avez renseigné ne correspond pas à ce nom d'utilisateur." });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('key'), {
          expiresIn : 60*60*24 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'ok',
          token: token
        });
      }   

    }
  });
});


apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    jwt.verify(token, app.get('key'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Le token n\'est pas bon' });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'Merci de vous connecter' 
    });
    
  }
});

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
  UserModel.User.find({}, function(err, users) {
    res.json(users);
  });
});


// Voir un utilisateur
apiRoutes.get('/users/:id', UserRoutes.seeSingle);

// Editer le mdp d'un utilisateur
apiRoutes.put('/users/:id', UserRoutes.editUser);


// voir tous les livres
apiRoutes.get('/books', BookRoutes.seeAll);

// ajouter un livre + l'insert dans la collection
apiRoutes.post("/books", BookRoutes.addBook);

// voir un livre en particulier
apiRoutes.get("/books/:id", BookRoutes.seeSingle);



app.use('/api', apiRoutes);




app.listen(3001);
console.log('Listening on port 3001...');