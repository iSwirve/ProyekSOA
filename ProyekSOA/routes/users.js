const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const joi = require('joi').extend(require('@joi/date'));
const keyJWT = "Proyek_SOA";

router.post("/register", async (req, res) => {
    let {email,username,nama_user,password,password_confirmation,no_telp} = req.body;
    let validuser = joi.object({
        email:joi.string().email().required(),
        username: joi.string().required(),
        nama_user: joi.string().required(),
        password:joi.string().required(),
        password_confirmation: joi.any().valid(joi.ref('password')).required(),
        no_telp:joi.string().max(12).min(10).regex(/[0-9]/).required()
    });
    let hasil = validuser.validate(req.body); 
    if(hasil.error) return res.status(400).json(hasil.error); 
    let user = (await User.cek_username(username))[0];
        if (user) {
            return res.status(404).send({
                message: "username sudah ada!",
            });
        }
        let cek_email = (await User.get(email))[0];
        if (cek_email) {
            return res.status(404).send({
                message: "email sudah ada!",
            });
        }

    var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
    
    today = mm + '/' + dd + '/' + yyyy;
    try {
        let user = {
            email: email,
            username:username,
            nama_user:nama_user,
            password:password,
            no_telp: no_telp,
            tanggal_daftar:today
        };
        await User.add(user);
        
        const{tanggal_daftar,...data} = user;
    
        return res.status(201).send({
            data
        });
    } catch (error) {
        return res.status(400).send({
            message: "field tidak sesuai ketentuan!",
        });
    }
})

router.post("/login",async (req,res)=>{
    let {email,password} = req.body;
    let validuser = joi.object({
        email:joi.string().email().required(),
        password:joi.string().required()
    });
    let hasil = validuser.validate(req.body); 
    if(hasil.error) return res.status(400).json(hasil.error);
    let user = (await User.login(email,password))[0];
    if (!user) {
        return res.status(404).send({
            message: "Wrong email/password!",
        });
    }
    let pengguna = {
        email : email,
        password : password,
    }
    let token = jwt.sign(pengguna, keyJWT, {expiresIn: '5m'});

    let body = {
        email:email,
        waktu_login:new Date().toLocaleString('en-GB', {hour12: true}),
        token:token
    }
    return res.status(200).send({body});

})


module.exports = router;