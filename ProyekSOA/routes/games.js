const { response } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const joi = require("joi");
const Game = require("../models/Game");
const axios =require('axios');
const { boolean } = require("joi");
const keysteam = "8455AC3CD36E18453E97ADCCC24F8A4F";

router.get("/search", async (req, res) => {
    let {name} = req.query;
    let result = await Game.get(name);

    return res.status(200).send(result);
})

router.get("/detail", async (req, res) => {
    let {id} = req.query;
    let result = await Game.detail(id);

    return res.status(200).send(result);
})


module.exports = router;