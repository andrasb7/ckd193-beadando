module.exports = {
    identity: 'recipe',
    connection: 'default',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        name: {
            type: 'string',
            required: true,
        },
        type: {
            type: 'string',
            enum: ['shot', 'long drink', 'cocktail', 'aperitif'],
            required: true,
        },
        base: {
            type: 'string',
            enum: ['vodka', 'rum', 'whisky', 'gin', 'tequila', 'egyeb'],
            required: true,
        },
        recipe: {
            type: 'string',
            required: true,
        },
        comments: {
            collection: 'comment',
            via: 'recipe'
        },
        user: {
            model: 'user',
        },
    }
};