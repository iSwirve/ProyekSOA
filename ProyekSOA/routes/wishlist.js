const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const joi = require('joi').extend(require('@joi/date'));
const keyJWT = "Proyek_SOA";
const Game = require("../models/Game");
const Wishlist = require("../models/Wishlist");

router.post("/:game_id", async (req, res) => {
    let token = req.header("x-auth-token");
    let game_id = req.params.game_id;
    let userObj;
    try {
        userObj = jwt.verify(token, keyJWT);
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            Message: "unauthorized"
        });
    }
    let game = await Game.detail(game_id);

    if(!game)
    {
        return res.status(404).send({
            message : "Game tidak ditemukan"
        })
    }

    await Wishlist.add(userObj.email, game_id);
    return res.status(200).send({
        message : "Berhasil menambahkan game " + game.title + " ke dalam wishlist"
    })


    
})


module.exports = router;