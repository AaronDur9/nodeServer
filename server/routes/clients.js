'use strict';

var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const Client = mongoose.model('Client');

const CustomError = require('../modules/customError.js');

// const config = require('../config');
const random = require('random-integer-number');
const md5 = require('md5');
const config = require('../config');


router.get('/', function(req, res, next) {

    Client.list((err, clientList) => {
        if (err) {
            next(err);
            return;
        }
        res.json(clientList);
    });
});


// POST /users/register
router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const dni = req.body.dni;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const address = req.body.address;
    const province = req.body.province;
    const password = req.body.password;
    const obversePath = req.body.obversePath;
    const reversePath = req.body.reversePath;
    const videoPath = req.body.videoPath;

    if (!name || !surname || !dni || !phoneNumber || !email || !address || !province ||
        !password || !obversePath || !reversePath || !videoPath) {
        const error = new CustomError('CLIENT_REGISTER', req.lan);
        res.json(error);
        return;
    }

    //Hash de la contraseña
    const salt = random();
    const newPass = password + salt + config.clientsPepper;
    const hash = md5(newPass);

    const clientInfo = req.body;
    clientInfo.password = hash;
    clientInfo.salt = salt;
    clientInfo.date = +new Date();
    clientInfo.pending = true;
    clientInfo.assigned = false;


    //Insertamos el cliente
    const client = new Client(clientInfo);
    client.save((err, insertedclient) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ success: true, result: insertedclient });

    });

});

module.exports = router;