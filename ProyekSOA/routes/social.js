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

router.get(`/getRequestFriend`,async(req,res)=>{
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
    let result = await Social.getRequestFriendlist(userObj.email);
    if(result != ""){
        return res.status(200).send(result);
    }
    return res.status(200).send({"Message" : "Request Friendlist saat ini kosong"});

})

router.post(`/requestFriendlist`,async(req,res)=>{
    let {email_friend,request_condition} = req.body
    let token = req.header("x-auth-token");
    let request = 0;
    if(email_friend == "" || request_condition == ""){
        return res.status(400).send({"Message" : "Field Tidak sesuai dengan ketentuan!"})
    }
    if(request_condition.toLowerCase() == "accept"){
        request = 1;
    }else if (request_condition.toLowerCase() == "declined"){
        request = 2;
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
    let result = await Social.requestFriendlist(userObj.email,email_friend,request);
    return res.status(200).send(result);
})

router.post('/giftgame',async(req,res)=>{
    let {username,name_game} = req.body
    let result = await Social.giftGame(username,name_game)
    return res.status(200).send(result)
})

router.delete(`/deleteFriend`,async(req,res)=>{
    let {email_req} = req.body
    let token = req.header("x-auth-token");
    if(email_req == ""){
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
    let result = await Social.deletedFriendlist(userObj.email,email_req)
    if(result !== ""){
        return res.status(201).send({
            Message: "User Deleted!"
        });
    }else{
        return res.status(400).send({
            Message: "Error!"
        });
    }
    return res.status(201).send(result)
})



module.exports = router