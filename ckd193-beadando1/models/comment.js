module.exports = {
    identity: 'comment',
    connection: 'default',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        text: {
            type: 'string',
            required: true,
        },
        username: {
            type: 'string',
            required: true,
            defaultsTo: 'anonymous (test)',
        },
        recipe: {
            model: 'recipe',
        },
        user: {
            model: 'user',
        },
    }
};