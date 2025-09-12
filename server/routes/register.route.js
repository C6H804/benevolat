const express = require("express");
const joi = require("joi");

const schema = joi.object({
    name: joi.string().min(2).max(255).required(),
    email: joi.string().email().max(255).required(),
    password: joi.string().min(6).max(99).required(),
    description: joi.string().max(1000).optional(),
    type: joi.string().valid("volunteer", "association").optional()
});

const router = express.Router();

const getUserByEmail = require("../dao/users.dao").getUserByEmail;
const createUser = require("../dao/users.dao").createUser;
const returnHash = require("../utils/hash.js");
const createToken = require("../utils/createToken.js");


router.post("/", async (req, res) => {
    console.log("register route received");
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const description = req.body.description;
    const type = req.body.type;
    
    const error = await schema.validate({ name, email, password }).error;
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await getUserByEmail(email);
    if (user.valid == false) return res.status(user.code).json({ message: user.message });

    if (user.value.length > 0) return res.status(409).json({ message: "email already used" });

    const hashedPassword = await returnHash(password);
    if (hashedPassword.valid == false) return res.status(500).json({ message: "internal error" });

    const newUser = await createUser(name, email, hashedPassword.value, description, type);
    if (newUser.valid == false) return res.status(newUser.code).json({ message: newUser.message });
    console.log(newUser.value);

    const userId = newUser.value.insertId;

    // create token
    const token = await createToken({ userId, email, type });
    if (token.valid == false) return res.status(token.code).json({ message: token.message });


    return res.status(201).json({ message: "user created", token: token.value});



});



module.exports = router;