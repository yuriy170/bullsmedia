require('dotenv').config();
const fastify = require('fastify');
const rateLimit = require('@fastify/rate-limit');
const fs = require("fs");

const redirectRoute = require('../routes/redirect');
const retrieveRoute  = require('../routes/retrieve');

const PORT = process.env.PORT || 443;

const handleStart = async (httpsOptions) => {
    const server = fastify(httpsOptions);

    //Register rate limit
    await server.register(rateLimit, {
        max: 3, //maximum 100 queries
        timeWindow: '1 minute', // within 1 minute
        // allowList: ['127.0.0.1'], // for example, whitelist for localhost
    });

    //Error handler for rateLimit
    server.setErrorHandler((error, request, reply) => {
        if (error.statusCode === 429) {
            reply.code(429)
            error.message = 'You hit the rate limit! Slow down please!'
        }
        reply.send(error)
    });

    //Register routes
    await server.register(redirectRoute);
    await server.register(retrieveRoute);

    //Starting fastify server on 443 port
    await server.listen({port: PORT}, () => {
        console.log(`Fastify server started on port ${PORT}`);
    })
    return server;
}

const handleShutdown = (server) => {
    try {
        //Gracefully shutdown server on SIGTERM signal
        process.on('SIGTERM', async (err) => {
            console.log('Received SIGTERM, shutting down server');
            server.close();
            console.log('Server shut down gracefully');
            process.exit(0);
        });
        //... and SIGINT signal
        process.on('SIGINT', async (err) => {
            console.log('Received SIGINT, shutting down server');
            server.close();
            console.log('Server shut down gracefully');
            process.exit(0);
        });

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const fastifySetup = () => {

    //Setting up config for SSL
    const httpsOptions = {
        https: {
            key:  fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH)
        },
        logger: false
    };

    handleStart(httpsOptions).then((server) => {
        handleShutdown(server);
    }).catch((error) => {
        console.log('Error while starting server: ', error);
    });
}
module.exports = fastifySetup;