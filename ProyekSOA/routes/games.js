const { response } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const joi = require("joi");
const Game = require("../models/Game");
const keyJWT = "tugasSOA6_E401";

router.post("", async (req, res) => {

})


module.exports = router;