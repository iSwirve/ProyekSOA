const { response } = require("express");
const express = require("express");
const router = express.Router();
const Social = require("../models/Social");
const jwt = require('jsonwebtoken');
const axios = require('axios');

const keyJWT = "Proyek_SOA";

router.get(`/getFriendlist`,async(req,res)=>{
    let token = req.header("x-auth-token");
    let userObj;
    try {
        userObj = jwt.verify(token, keyJWT);
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            Message: "unauthorized"
        });
    }
    let result = await Social.getFriendlist(userObj.email);
    if(result != ""){
        return res.status(200).send(result);
    }
    return res.status(200).send({"Message" : "Friendlist saat ini kosong"});

})

router.post(`/addFriendlist`,async(req,res)=>{
    let {email_friend} = req.body
    let token = req.header("x-auth-token");
    if(email_friend == ""){
        return res.status(400).send({"Message" : "Field Tidak sesuai dengan ketentuan!"})
    }
    let userObj;
    try {
        userObj = jwt.verify(token, keyJWT);
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            Message: "unauthorized"
        });
    }
    let result = await Social.addFriendlist(userObj.email,email_friend);
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


module.exports = router