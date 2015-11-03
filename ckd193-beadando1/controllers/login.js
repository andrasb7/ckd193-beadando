var express = require('express');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();

router.get('/', function (req, res) {
    res.render('login/index');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/recipes/list',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Hiányzó adatok'
}));

router.get('/signup', function (req, res) {
    res.render('login/signup', {
        errorMessages: req.flash('error')
    });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect:    '/login',
    failureRedirect:    '/login/signup',
    failureFlash:       true,
    badRequestMessage:  'Hiányzó adatok'
}));

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

module.exports = router;