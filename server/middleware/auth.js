const express = require("express");


const readToken = require("../utils/readToken");


const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "no token provided" });
    // verify that authHeader is in the format "Bearer token"
    if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "invalid token format" });
    const token = authHeader.split(" ")[1];
    const verify = readToken(token);
    if (verify.valid == false) return res.status(verify.code).json({ message: verify.message });
    req.user = verify.value;
    next();
}

module.exports = auth;