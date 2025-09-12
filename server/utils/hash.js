const bcrypt = require("bcrypt");


const returnHash = async (text) => {
    const saltRounds = 12;
    try {
        const hash = await bcrypt.hash(text, saltRounds);
        return { valid: true, value: hash };
    } catch (error) {
        console.log("error returnHash");
        console.error(error);
        return { valid: false, message: "hashing error", code: 500 };
    }

}

module.exports = returnHash;