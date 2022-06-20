const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const Transaction = require("../models/Transaction");

const axios = require('axios');


const jwt = require('jsonwebtoken');
const joi = require('joi').extend(require('@joi/date'));
const keyJWT = "Proyek_SOA";
const dokuLib = require('jokul-nodejs-library');

router.post("/buy", async (req, res) => {

    let token = req.header("x-auth-token");
    let game_id = req.body.game_id;
    let userObj;
    try {
        userObj = jwt.verify(token, keyJWT);
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            Message: "unauthorized"
        });
    }
    let game = await Game.detail(game_id);
    console.log(game);
    if (!game) {
        return res.status(404).send({
            message: "Game tidak ditemukan"
        })
    }

    let transactionCheck = await Transaction.checkTransaction(userObj.email, game_id);
    if(transactionCheck.length)
    {
        return res.status(400).send({
            message : "Transaksi sedang berlangsung / sudah pernah beli"
        })
    }

    let invoice = await Transaction.getInvoice();
    console.log(invoice);
    let user = await User.get(userObj.email);

    let channel = "doku";
    let setupConfiguration = dokuLib.SetupConfiguration;
    setupConfiguration.environment = 'sandbox';
    setupConfiguration.client_id = "BRN-0230-1653882825953";
    setupConfiguration.merchant_name = "GameinAja";
    setupConfiguration.shared_key = "SK-ikQkU9UEHEmiiHELCoum";
    setupConfiguration.serverLocation = dokuLib.getServerLocation(setupConfiguration.environment);
    setupConfiguration.channel = channel;

    let paymentCodeRequest = dokuLib.PaymentCodeRequestDto;
    paymentCodeRequest.customer.name = user[0].nama_user;
    paymentCodeRequest.customer.email = userObj.email;
    paymentCodeRequest.order.invoice_number = invoice;
    paymentCodeRequest.order.amount = 20000;

    paymentCodeRequest.virtual_account_info.reusable_status = false;
    paymentCodeRequest.virtual_account_info.expired_time = 60;
    try {
        let dat;
        if (channel == 'mandiri') {
            dat = await dokuLib.generateMandiriVa(setupConfiguration, paymentCodeRequest);
        } else if (channel == 'doku') {
            dat = await dokuLib.generateDOKUVa(setupConfiguration, paymentCodeRequest);
            // dat = await axios.post("https://api-sandbox.doku.com/doku-virtual-account/v2/payment-code");
        }

        let data = {
            invoice : invoice,
            email_user : userObj.email,
            id_game : game_id,
            status : 0
        }

        await Transaction.add(data);
        return res.status(200).send(dat);


    }
    catch (e) {
        return res.status(400).send(e);
    }




})

// router.put("/verify/:invoice", async (req, res) =>{
//     let invoice = req.params.invoice;
//     try{
//         let link = "https://api-sandbox.doku.com/orders/v1/status/" + invoice;
//         let status = await axios.get(link);
//         return res.status(200).send(status.data);
//     }
//     catch(e)
//     {
//         return res.status(400).send(e);
//     }
    
// })




module.exports = router;


function randomInvoice(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function post(setupConfiguration, paymentCodeRequest, channel) {
    try {
        let response;

        if (channel == 'mandiri') {
            response = await dokuLib.generateMandiriVa(setupConfiguration, paymentCodeRequest);
        } else if (channel == 'doku') {
            response = await dokuLib.generateDOKUVa(setupConfiguration, paymentCodeRequest);

        } else if (channel == 'mandiri-syariah') {
            //do something
        }

        return response;
    } catch (error) {
        console.log(error);
        return "error";
    }

}