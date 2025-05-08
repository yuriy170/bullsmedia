 const redirectSchema = {
    querystring: {
        type: 'object',
        required: ['keyword', 'src', 'creative'],
        properties: {
            keyword: { type: 'string', maxLength: 100 },
            src: { type: 'string', maxLength: 100 },
            creative: { type: 'string', maxLength: 100 },
        }
    }
}

const retrieveSchema = {
    querystring: {
        type: 'object',
        required: ['our_param'],
        properties: {
            our_param: { type: 'string', maxLength: 100 },
        }
    }
}

module.exports = {
    redirectSchema,
    retrieveSchema
};