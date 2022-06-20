const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = require("./routes/users");
const games = require("./routes/games");
const transaction = require("./routes/transaction");
const wishlist = require("./routes/wishlist");
const social = require("./routes/social")
const admin = require("./routes/admin")


app.use("/api/users/", users);
app.use("/api/games/", games);
app.use("/api/transaction/", transaction);
app.use("/api/wishlist/", wishlist);
app.use("/api/socials/", social);
app.use("/api/admin/", admin);




app.listen(3000, () => {
    console.log("Listening to http://localhost:3000");
});