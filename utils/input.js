const isValidInput = (str) => {
    //Allow 1–100 characters: any Unicode letters/numbers and URL-safe special characters
    const regexValidation = /^[\p{L}\p{N} .:_\-@+/=&#%?,]{1,100}$/u;
    return typeof str === 'string' && regexValidation.test(str);
}

module.exports = {
    isValidInput
}