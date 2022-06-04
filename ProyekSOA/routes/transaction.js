const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const axios = require('axios');


const jwt = require('jsonwebtoken');
const joi = require('joi').extend(require('@joi/date'));
const keyJWT = "Proyek_SOA";
const dokuLib = require('jokul-nodejs-library');

router.post("/buy", async (req, res) => {
    let channel = req.body.channel;
    let setupConfiguration = dokuLib.SetupConfiguration;
    setupConfiguration.environment = 'sandbox';
    setupConfiguration.client_id = "BRN-0230-1653882825953";
    setupConfiguration.merchant_name = "GameinAja";
    setupConfiguration.shared_key = "SK-ikQkU9UEHEmiiHELCoum";
    setupConfiguration.serverLocation = dokuLib.getServerLocation(setupConfiguration.environment);
    setupConfiguration.channel = channel;

    let paymentCodeRequest = dokuLib.PaymentCodeRequestDto;
    paymentCodeRequest.customer.name = req.body.customerName;
    paymentCodeRequest.customer.email = req.body.email;
    paymentCodeRequest.order.invoice_number = randomInvoice(30);
    paymentCodeRequest.order.amount = req.body.amount;

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
        return res.status(200).send(dat);



    }
    catch (e) {
        return res.status(400).send(e);
    }




})




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