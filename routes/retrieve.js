const { retrieveSchema} = require("../config/fastify/schema/redirectSchema");
const { isValidInput } = require("../utils/input");
const { getNewParam, getNewParamHistory } = require("../services/pgService");


function createRetrieveHandler(type) {
    return async (request, reply) => {
        const { our_param } = request.query;

        if (![our_param].every(isValidInput)) {
            return reply.status(400).send({ error: 'Invalid characters in parameters' });
        }

        try {
            const ourParam = type === 'single' ? await getNewParam(our_param) : await getNewParamHistory(our_param);
            return reply.status(200).send(ourParam);
        } catch (error) {
            return reply.status(500).send({ error: error?.message });
        }
    };
}

async function retrieveRoute(fastify, reply) {
    const options = { schema: retrieveSchema };

    fastify.get('/retrieve_original/history', options, createRetrieveHandler('list'));
    fastify.get('/retrieve_original', options, createRetrieveHandler('single'));
}

module.exports = retrieveRoute;