var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var Waterline = require('waterline');
var waterlineConfig = require('./config/waterline');
var memoryAdapter = require('sails-memory');
var diskAdapter = require('sails-disk');

var recipeCollection = require('./models/recipe');
var userCollection = require('./models/user');
var commentCollection = require('./models/comment');

var recipesController = require('./controllers/recipes');
var loginController = require('./controllers/login');

//-------------------------------------------

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'felhnev',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, felhnev, password, done) {
        req.app.models.user.findOne({ felhnev: felhnev }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező felhasználónév.' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            })
        });
    }
));

// Stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'felhnev',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, felhnev, password, done) {
        req.app.models.user.findOne({ felhnev: felhnev }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, user);
        });
    }
));

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

function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
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
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(setLocalsForLayout());

app.use('/recipes', ensureAuthenticated, recipesController);
//app.use('/recipes', recipesController);
app.use('/login', loginController);



//endpoints
app.get('/', function (req, res) {
   res.render('index');
});

app.get('/delete=:id', function (req, res) {
    
    var id = req.params.id;
    
    app.models.recipe.destroy({ id: id})
    .then(function (recipe) {
        //siker
        req.flash('info', 'Hiba sikeresen törölve!');
        res.redirect('/recipes/list');
    })
    .catch(function (err) {
        //hiba
        console.log(err);
    });
});

app.get('/edit=:id', function (req, res) {
    var id = req.params.id;
    
    app.models.recipe.findOne({ id: id}).populate('comments').then(function (recipe) {
        console.log(recipe);
        res.render('recipes/edit', {
            types : [
               '',
                'shot',
                'long drink',
                'cocktail',
                'aperitif'
            ],
            base : [
                '',
                'vodka',
                'rum',
                'whisky',
                'gin',
                'tequila',
                'egyeb'
            ],
            recipe: recipe,
            isEdit: true,
            isnotEdit: false,
            data: recipe,
        }); 
    });

});

app.post('/edit=:id', function (req, res) {
    var id = req.params.id;
        // adatok ellenőrzése
    req.checkBody('name', 'Hibás név').notEmpty().withMessage('A nevet kötelező megadni!');
    req.sanitizeBody('type').escape();
    req.checkBody('type', 'Hibás típus').notEmpty().withMessage('A típust kötelező megadni!');
    req.sanitizeBody('base').escape();
    req.checkBody('base', 'Hibás alap').notEmpty().withMessage('Az alap italt kötelező megadni!');
    req.sanitizeBody('recipe').escape();
    req.checkBody('recipe', 'Hibás recept').notEmpty().withMessage('A receptet kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/recipes/new');  
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        app.models.recipe.update(id,{
            name: req.body.name,
            type: req.body.type,
            base: req.body.base,
            recipe: req.body.recipe,
        })
        .then(function (recipe) {
            //siker
            req.flash('info', 'Koktél sikeresen frissítve!');
            res.redirect('/recipes/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });

    }
});

app.get('/operator', ensureAuthenticated, andRestrictTo('operator'), function(req, res) {
    res.end('operator');
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

//id lekérdezés
app.get('/:id', function(req, res) {
    
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    var id = req.params.id;
    
    app.models.recipe.findOne({ id: id}).populate('comments').then(function (recipe) {
        console.log(recipe);
        res.render('recipes/show', {
            isEdit: false,
            isnotEdit: true,
            recipe: recipe,
            
            messages: req.flash('info'),
            
            validationErrors: validationErrors,
            data: data,
        }); 
    });
});

app.post('/:id', function(req, res){
    
    req.checkBody('text', 'Hibás comment').notEmpty().withMessage('Írj valamit!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    var id = req.params.id;
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/' + id); 
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        app.models.comment.create({
            text: req.body.text,
            username: 'Guest',
            recipe: id,
        })
        .then(function (recipe) {
            //siker
            req.flash('info', 'Megjegyzés sikeresen felvéve!');
            res.redirect('/' + id);
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });

    }
});


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