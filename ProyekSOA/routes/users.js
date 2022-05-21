const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const joi = require("joi");
const User = require("../models/User");
const keyJWT = "tugasSOA6_E401";

router.post("/register", async (req, res) => {
    
})


module.exports = router;