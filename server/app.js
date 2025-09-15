const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const app = express();
const port = process.env.PORT;

// setup static files
// app.use(express.static(path.join(__dirname, "../src")));
// useless

// setup routes
app.use(express.json());
app.use("/api/register", require("./routes/register.route"));
app.use("/api/connexion", require("./routes/connexion.route"));
app.use("/api/missions", require("./routes/missions.route"));
app.use("/api/apply", require("./routes/apply.route"));
app.use("/api/auth", require("./routes/auth.route"));
// setup 404

app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port + " on port " + port);
});