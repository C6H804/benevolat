const mysql = require("mysql2");

const db = require("../db/db");

const getUserByEmail = async (email) => {
    try {
        const [results] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
        return { valid: true, value: results };
    } catch (error) {
        console.log("error getUserByEmail");
        console.error(error);
        return { valid: false, message: "database error", code: 500 };
    }
};

const createUser = async (name, email, password, description, type) => {
    try {
        const [results] = await db.execute("INSERT INTO users (name, email, password, description, type) VALUES (?, ?, ?, ?, ?)", [name, email, password, description, type]);
        return { valid: true, value: results };
    } catch (error) {
        console.log("error createUser");
        console.error(error);
        return { valid: false, message: "database error", code: 500 };
    }
}



module.exports = { getUserByEmail, createUser };