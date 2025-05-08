const crypto = require("crypto");
const base62 = require("base62");

const getFingerPrint = (keyword, src, creative) => {
    const raw = `${keyword}|${src}|${creative}`;
    return crypto.createHash('sha256').update(raw).digest('base64url');
}

const getBase62 = (keyword, src, creative, version) => {
    //Making string from input parameters
    const raw = `${keyword}|${src}|${creative}|${version}`;

    //Generate SHA256
    const hash = crypto.createHash('sha256').update(raw).digest('hex');

    //Convert to bigint
    const bigInt = ('0x' + Buffer.from(hash, 'hex').toString('hex'));

    //Encoding to Base62 and return value
    return base62.encode(bigInt).slice(0, 8);
}

module.exports = {
    getFingerPrint,
    getBase62
}