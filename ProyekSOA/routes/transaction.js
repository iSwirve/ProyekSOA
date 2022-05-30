const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const axios =require('axios');


const jwt = require('jsonwebtoken');
const joi = require('joi').extend(require('@joi/date'));
const keyJWT = "Proyek_SOA";

router.post("/buy", async (req, res) => {
    let {id} = req.query;
    let Client_Id = req.header("Client_Id");
    let gameRes = await Game.detail(id);
    // return res.status(200).send(gameRes);
    let url = "https://api-sandbox.doku.com/checkout/v1/payment";
    let result = axios.get(url);
    return res.status(200).send(result);
    
})



module.exports = router;