const { response } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const joi = require("joi");
const User = require("../models/User");
const Game = require("../models/Game");
const Admin = require("../models/Admin");
const Library = require("../models/Library");


const axios =require('axios');
const { boolean } = require("joi");
const db = require("../database");
const Transaction = require("../models/Transaction");
const keysteam = "8455AC3CD36E18453E97ADCCC24F8A4F";
const keyJWT = "Proyek_SOA";

router.get("/checkTransactions/:invoice?", async (req,res) =>{
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
    let invoice = req.params.invoice;
    let result = await Admin.getTransaction(invoice);
    if(userObj.email != "admin")
    {
        return res.status(400).send("Antum bukan admin");
    }
    if(invoice)
    {
        if(!result.length)
        {
            return res.status(404).send({
                message : "Transaksi tidak ditemukan"
            })
        }
        let user = await User.get(result[0].email_user);
        let game = await Game.detail(result[0].id_game); 
        let objectInv = {
            Invoice : result[0].invoice,
            username : user[0].username,
            nama_game : game.title,
            status : ((result[0].status == 0) ? "Pending" : "Accepted")
        }
        return res.status(200).send(objectInv);
    }

    let objData = [];
    for (let i = 0; i < result.length; i++) {
        const obj = result[i];
        let user = await User.get(obj.email_user);
        let game = await Game.detail(obj.id_game); 
        let objectInv = {
            Invoice : obj.invoice,
            username : user[0].username,
            nama_game : game.title,
            status : ((obj.status == 0) ? "Pending" : "Accepted")
        }
        objData.push(objectInv);
    }
    return res.status(200).send(objData);
})

router.post("/verify/:invoice", async (req,res) =>{
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
    if(userObj.email != "admin")
    {
        return res.status(400).send("Antum bukan admin");
    }
    let invoice = req.params.invoice;
    let invInfo = await Admin.getTransaction(invoice);
    
    let verify = await Admin.verifyTransaction(invoice);
    if(verify == "1")
    {
        let libObj = {
            email_user : invInfo[0].email_user,
            id_game : invInfo[0].id_game
        }
        await Library.add(libObj);

        return res.status(200).send({
            message : `${invoice} BERHASIL DIVERIFIKASI`
        })
    }
    else{
        return res.status(400).send({
            message : "Invoice sudah pernah diverifikasi"
        })
    }

})


router.delete("/deleteuser", async (req, res) => {
    let { email, username } = req.body;
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
    if(userObj.email != "admin")
    {
        return res.status(400).send("Antum bukan admin");
    }
    let validuser = joi.object({
        email: joi.string().email().required(),
        username: joi.string().required()
    });
    let hasil = validuser.validate(req.body);
    if (hasil.error) return res.status(400).json(hasil.error);
    let data = await User.get(email);
    let data2 = await User.cek_username(username);
    if (!data.length) {
        return res.status(404).send({
            message: "data tidak ditemukan!",
        });
    }
    if (!data2.length) {
        return res.status(404).send({
            message: "data tidak ditemukan!",
        });
    }
    await User.delete(email, username);
    return res.status(201).send({
        message: "delete berhasil!",
    });
})


module.exports = router;