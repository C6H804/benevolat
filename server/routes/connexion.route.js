const express = require("express");
const joi = require("joi");

const schema = joi.object({
    email: joi.string().email().max(255).required(),
    password: joi.string().min(6).max(99).required(),
});

const router = express.Router();

const createToken = require("../utils/createToken");
const getUserByEmail = require("../dao/users.dao").getUserByEmail;
const verifyHash = require("../utils/verifyHash");


router.post("/", async (req, res) => {
    console.log("connexion route received");
    const email = req.body.email;
    const password = req.body.password;
    const validateUser = await schema.validate({ email, password });
    if (validateUser.error) return res.status(400).json({ message: validateUser.error.details[0].message });

    const user = await getUserByEmail(email);
    if (user.valid == false) return res.status(user.code).json({ message: user.message });
    console.log(user.value);
    if (user.value.length == 0) return res.status(404).json({ message: "user not found" });
    const hashedPassword = user.value[0].password;
    const verify = await verifyHash(password, hashedPassword);
    if (verify.valid == false) return res.status(verify.code).json({ message: "servor error" });
    if (verify.value == false) return res.status(401).json({ message: "invalid password" });
    
    const type = user.value[0].type;
    const userId = user.value[0].id;

    const token = await createToken({userId, email, type });
    if (token.valid == false) return res.status(token.code).json({ message: token.message });
    return res.status(200).json({ message: "user connected", token: token.value,});

});

module.exports = router;