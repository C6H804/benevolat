const jwt = require("jsonwebtoken");

const createToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        return ({ valid: true, value: token });
    } catch (error) {
        console.log("error creating token");
        console.error(error);
        return ({ valid: false, message: "could not create token", code: 500 });
    }
    
}

module.exports = createToken;