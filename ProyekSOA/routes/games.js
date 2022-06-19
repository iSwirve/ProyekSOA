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
    if(!result)
    {
        return res.status(404).send({
            message : "Game tidak ditemukan"
        })
    }
    return res.status(200).send(result);
})

router.get("/category", async (req, res) => {
    let {category_name} = req.query;
    try{
        let result = await Game.category(category_name);
        return res.status(200).send(result);
    }
    catch(Err)
    {
        return res.status(400).send("game tidak ditemukan");
    }
})


router.get("/sort", async (req, res) => {
    let {alphabet} = req.query;
    let result = await Game.sort(alphabet);
    return res.status(200).send(result);
})


module.exports = router;