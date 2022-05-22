const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = require("./routes/users");
const games = require("./routes/games");

app.use("/api/users/", users);
app.use("/api/games/", games);

app.listen(3000, () => {
    console.log("Listening to http://localhost:3000");
});