var express = require('express');

var router = express.Router();

var statusTexts = {
    '' : '',
    'shot': 'shot',
    'long drink': 'long drink',
    'cocktail': 'cocktail',
    'aperitif': 'aperitif',
};

var statusClasses = {
    '': '',
    'shot': 'danger',
    'long drink': 'info',
    'cocktail': 'default',
    'aperitif': 'success',
};

function decorateRecipes(recipesContainer) {
    return recipesContainer.map(function (e) {
        e.typeText = statusTexts[e.type];
        e.typeClass = statusClasses[e.type];
        return e;
    });
}

router.get('/list', function (req, res) {
    req.app.models.recipe.find().then(function (recipes) {
        console.log(recipes);
        res.render('recipes/list', {
            recipes: decorateRecipes(recipes),
            messages: req.flash('info')
        });
    }); 
});

router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();

   res.render('recipes/new', {
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
        validationErrors: validationErrors,
        data: data,
   });

});

router.post('/new', function (req, res) {
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
        req.app.models.recipe.create({
            name: req.body.name,
            type: req.body.type,
            base: req.body.base,
            recipe: req.body.recipe,
            numberOfMessages: 0,
        })
        .then(function (recipe) {
            //siker
            req.flash('info', 'Hiba sikeresen felvéve!');
            res.redirect('/recipes/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });

    }
});



module.exports = router;
