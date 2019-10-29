function validEmailFPT (str) {
    const regex = new RegExp(/^([a-zA-Z0-9_.]{3,})@(fpt.com.vn)$/);
    return regex.test(str);
}

module.exports = {
    validEmailFPT,
};