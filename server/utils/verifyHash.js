const bcrypt = require("bcrypt");

const verifyHash = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return { valid: true, value: match };
    } catch (error) {
        console.log("error verifyHash");
        console.error(error);
        return { valid: false, message: "hashing error", code: 500 };
    }
}

module.exports = verifyHash;