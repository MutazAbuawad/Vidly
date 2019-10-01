const Joi = require('joi');
require('dotenv').config({ path: __dirname + '/.env' });
const jwt = require('jsonwebtoken');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log(req.body)
    console.log(req.body.email)

    let user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (!user) {
        return res.status(400).send("Invalid Email or Password");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    console.log(validPassword)

    if (!validPassword) {
        return res.status(400).send("Invalid Email or Password");
    }
    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.vidly_jwtPrivateKey);
    res.send(token);
});

function validate(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}

module.exports = router;
