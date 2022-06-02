const { response } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const joi = require("joi");
const axios =require('axios');
const Social = require("../models/Social");

router.get(`/getFriendlist`,async(req,res)=>{
    let result = await Social.getFriendlist();
    return res.status(200).send(result);
})

router.post(`/addFriendlist`,async(req,res)=>{
    let {username} = req.body
    let result = await Social.addFriendlist(username);
    return res.status(200).send(result);
})

router.post('/giftgame',async(req,res)=>{
    let {username,name_game} = req.body
    let result = await Social.giftGame(username,name_game)
    return res.status(200).send(result)
})

router.delete(`/deleteFriend`,async(req,res)=>{
    let {username} = req.body
    let result = await Social.deleteFriendlist(username)
    return res.status(201).send(result)
})