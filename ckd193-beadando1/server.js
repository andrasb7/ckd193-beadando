var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var Waterline = require('waterline');
var waterlineConfig = require('./config/waterline');

var recipeCollection = require('./models/recipe');
var userCollection = require('./models/user');
var commentCollection = require('./models/comment');

var recipesController = require('./controllers/recipes');
var loginController = require('./controllers/login');
var indexController = require('./controllers/index');

//-------------------------------------------

var passport = require('passport');

// Middleware segédfüggvény
function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

//--------------------------------

var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(flash());
app.use(session({
    cookie: { maxAge: 600000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(setLocalsForLayout());

app.use('/', indexController);
app.use('/recipes', ensureAuthenticated, recipesController);
app.use('/login', loginController);

// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(recipeCollection));
orm.loadCollection(Waterline.Collection.extend(commentCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));

// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;
    
    app.models = models.collections;
    app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    
    console.log("ORM is started.");
});