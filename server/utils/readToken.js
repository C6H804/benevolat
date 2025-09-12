const jwt = require("jsonwebtoken");

const readToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        return { valid: true, value: decoded };
    } catch (error) {
        console.log("error readToken");
        console.error(error);
        return {
            valid: false, message: "invalid token", code: 401
        }
    }
}

module.exports = readToken;