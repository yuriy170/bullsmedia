const { redirectSchema } = require("../config/fastify/schema/redirectSchema");
const { isValidInput } = require("../utils/input");
const {getFingerPrint, getBase62} = require("../utils/fingerprint");
const redis = require("../config/redis");
const { getLastVersion, insertNewParam , disableNewParam } = require("../services/pgService");

async function redirectRoute(fastify, reply) {
    fastify.get('/', {
            schema: redirectSchema,
        },
        async (request, reply) => {
            const affiliateLink = process.env.REDIRECT_URL;
            const redisTime = process.env.REDIS_MAX_TIME || 600;
            const {keyword, src, creative, forcing} = request.query;
            const needForcing = parseInt(forcing) === 1;

            if (![keyword, src, creative].every(isValidInput)) {
                return reply.status(400).send({ error: 'Invalid characters in parameters' });
            }

            //Generating hash of required params
            const hasFingerPrint = getFingerPrint(keyword, src, creative);

            //Trying to get from redis cache version or generated params
            const cached = await redis.get(`v:${hasFingerPrint}`);
            if ( cached && !needForcing) {
                return reply.redirect(`${affiliateLink}?our_param=${cached}`, 302);
            }

            try {
                //Checking for last version of our_param by fingerprint
                const lastVersion = await getLastVersion(hasFingerPrint);
                let ourParamValue = lastVersion?.generated_param;

                if (!ourParamValue || needForcing) {

                    const insertParams = {
                        keyword: keyword,
                        src: src,
                        creative: creative,
                        version: lastVersion?.version,
                        fingerprint: hasFingerPrint,
                    }

                    //Force update our_param by increasing version param in db
                    if (ourParamValue && needForcing) {
                        const { fingerprint, ...rest } = insertParams;
                        const result = await disableNewParam(rest);
                        if(result?.rowCount > 0) {
                            insertParams.version = (insertParams.version || 0) + 1;
                        }
                    }

                    //Generating our_param value
                    const generatedParam = getBase62(keyword, src, creative, insertParams?.version);

                    //Trying to insert new value into DB...
                    const result = await insertNewParam({...insertParams, generated_param: generatedParam});

                    if (result?.rowCount > 0) {
                        ourParamValue = generatedParam;
                    }
                }

                if (ourParamValue?.length > 0) {
                    //... and to redis
                    await redis.set(`v:${hasFingerPrint}`, ourParamValue, 'EX', redisTime);
                    return reply.redirect(`${affiliateLink}?our_param=${ourParamValue}`, 302);
                }

            } catch (err) {
                console.log('pgerror: ', err);
            }
        })
}

module.exports = redirectRoute;