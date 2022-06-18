const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const jwt = require('jsonwebtoken');
const joi = require('joi').extend(require('@joi/date'));
const keyJWT = "Proyek_SOA";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/users");
    },
    
    filename: (req, file, cb) => {
        console.log(file);
        let username = "";
        if (req.body.username) {
            username = req.body.username;
        }
        const extension = file.originalname.split('.')[file.originalname.split('.').length-1];
        cb(null, username +"."+ extension);
    },
});



const upload = multer({
    
    storage: storage,
        fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error("Please upload an image"));
        }
        cb(null, true);
    },
});
router.post("/register",upload.single("foto_profile"), async (req, res) => {
    let {email,username,nama_user,password,password_confirmation,no_telp} = req.body;
    let foto_profile = "/uploads/users/" + req.file.filename;
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
            foto_profile: foto_profile,
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
// router.put("/update", upload.single("foto_profile"),async (req,res)=>{
//     //email dan username unique gk boleh diganti
//     let {email,nama_user,no_telp} = req.body;
//     let validuser = joi.object({
//         email:joi.string().email().required(),
//         nama_user: joi.string().required(),
//         no_telp:joi.string().max(12).min(10).regex(/[0-9]/).required()
//     });
//     let hasil = validuser.validate(req.body); 
//     if(hasil.error) return res.status(400).json(hasil.error); 
//     let temp = await User.get(email);
//     let foto_profile = temp.foto_profile;  
//     if (!req.file) {         
//         return res.status(400).send({
//             message: "field tidak sesuai ketentuan!",
//         });
//     }
//     await User.update(email, nama_user,no_telp,foto_profile);
//     let isi = await User.get(email);
//     const{tanggal_daftar,...data} = isi;
    
//     return res.status(201).send({
//         data
//     });
// })


module.exports = router;