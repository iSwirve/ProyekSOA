const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const jwt = require('jsonwebtoken');
const fs = require("fs");
var TeleSignSDK = require('telesignsdk');
const joi = require('joi').extend(require('@joi/date'));
const keyJWT = "Proyek_SOA";

const customerId = "5BC0A67A-F6A4-42CA-B585-D0E2547200E3";
  const apiKey = "nkdz5tMMyX58TJjBqZlQ8TCdYQyrObXX/CKa4P5B+lYgruBjfW0WyLGf41DnrZZkXv+O4LKI7flBwnf3DbYptQ==";
  const rest_endpoint = "https://rest-api.telesign.com";
  const timeout = 60*1000; // 60 secs

  const client = new TeleSignSDK( customerId,
      apiKey,
      rest_endpoint,
      timeout // optional
      // userAgent
  );

  


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
        const extension = file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, username + "." + extension);
    },
});



const upload = multer({

    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg)$/)) {
            cb(new Error("Please upload an image"));
        }
        cb(null, true);
    },
});
//russel
router.post("/register", upload.single("foto_profile"), async (req, res) => {
    let { email, username, nama_user, password, password_confirmation, no_telp } = req.body;
    //cmn bisa .jpg
    let foto_profile = "/uploads/users/" + req.file.filename;
    let validuser = joi.object({
        email: joi.string().email().required(),
        username: joi.string().required(),
        nama_user: joi.string().required(),
        password: joi.string().required(),
        password_confirmation: joi.any().valid(joi.ref('password')).required(),
        no_telp: joi.string().max(13).min(10).regex(/[0-9]/).required()
    });
    if (email == "admin") {
        return res.status(400).send("admin sudah pernah dipakai");
    }

    let hasil = validuser.validate(req.body);
    if (hasil.error) return res.status(400).json(hasil.error);
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
    const phoneNumber = no_telp;
    const message = `notifikasi berhasil mendaftar akun game store dengan username ${username}!`;
    const messageType = "ARN";
  console.log("## MessagingClient.message ##");

  function messageCallback(error, responseBody) {
      if (error === null) {
          console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
              ` => code: ${responseBody['status']['code']}` +
              `, description: ${responseBody['status']['description']}`);
      } else {
          console.error("Unable to send message. " + error);
      }
  }
  client.sms.message(messageCallback, phoneNumber, message, messageType);


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    try {
        let user = {
            email: email,
            username: username,
            nama_user: nama_user,
            foto_profile: foto_profile,
            password: password,
            no_telp: no_telp,
            tanggal_daftar: today
        };
        await User.add(user);

        const { tanggal_daftar, ...data } = user;

        return res.status(201).send({
            data
        });
    } catch (error) {
        return res.status(400).send({
            message: "field tidak sesuai ketentuan!",
        });
    }
})
//russel
router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    if (email == "admin") {
        if (password == "admin") {
            let objAdmin = {
                email : email,
                password : password
            }
            let token = jwt.sign(objAdmin, keyJWT, { expiresIn: '24h' });
            return res.status(200).send({
                email: email,
                waktu_login: new Date().toLocaleString('en-GB', { hour12: true }),
                token: token
            })
        }
    }

    let validuser = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    let hasil = validuser.validate(req.body);
    if (hasil.error) return res.status(400).json(hasil.error);
    let user = (await User.login(email, password))[0];
    if (!user) {
        return res.status(404).send({
            message: "Wrong email/password!",
        });
    }
    let pengguna = {
        email: email,
        password: password,
    }
    let token = jwt.sign(pengguna, keyJWT, { expiresIn: '24h' });

    let body = {
        email: email,
        waktu_login: new Date().toLocaleString('en-GB', { hour12: true }),
        token: token
    }
    return res.status(200).send({ body });

})
//russel
router.put("/update", upload.single("foto_profile"), async (req, res) => {
    //email dan username unique gk boleh diganti
    //cmn bisa .jpg
    let { email,username, nama_user, no_telp } = req.body;
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
    let validuser = joi.object({
        email: joi.string().email().required(),
        username: joi.string().required(),
        nama_user: joi.string().required(),
        no_telp: joi.string().max(12).min(10).regex(/[0-9]/).required()
    });
    let hasil = validuser.validate(req.body);
    if (hasil.error) return res.status(400).json(hasil.error);
    let temp = await User.get2(email,username);
    if (!temp.length) {
        return res.status(404).send({
            message: "data tidak ditemukan!",
        });
    }
    if (!req.file) {
        return res.status(400).send({
            message: "field tidak sesuai ketentuan!",
        });
    }
    foto_profile = "./uploads/posts/" + req.file.filename;
    await User.update(userObj.email, nama_user, no_telp);
    let isi = await User.get(email);
    const { tanggal_daftar, ...data } = isi;

    return res.status(201).send({
        data
    });
})



module.exports = router;