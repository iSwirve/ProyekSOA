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
    let {name} = req.query
    let querySearch = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json`;
    let resultGet = await axios.get(querySearch);
    let data = resultGet.data.applist;
    let arrdata=[];

    if(name=="")
    {
        for(let i=0; i<data.apps.length; i++)
        {
            let result = String(data.apps[i].name).toLowerCase().includes("test");
            if(data.apps[i].name != "" && !result)
            {
                arrdata.push({
                    id:data.apps[i].appid,
                    name:data.apps[i].name
                });
            }
        }
    }
    else if(name!="")
    {
        for(let i=0; i<data.apps.length; i++)
        {
            let result = String(data.apps[i].name).toLowerCase().includes(name.toLowerCase());
            if(result)
            {
                arrdata.push({
                    id:data.apps[i].appid,
                    name:data.apps[i].name
                });
            }
        }
    }

    return res.status(200).send(arrdata);
})


module.exports = router;