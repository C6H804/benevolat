const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");


router.use(auth);
router.post("/", (req, res) => {
    res.status(200).json({ message: "Authenticated", valid: true, user: req.user});
});


module.exports = router;