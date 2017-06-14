'use strict';

var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const User = mongoose.model('User');
const Client = mongoose.model('Client');
const CustomError = require('../modules/customError.js');
const random = require('random-integer-number');
const md5 = require('md5');
const config = require('../config');


router.get('/', function(req, res, next) {

    let ids = ['5940edade763591f80cb1533', '5940edbae763591f80cb1534'];
    Client.updateAssigment(ids, (err, clientList) => {
        if (err) {
            next(err);
            return;
        }

        res.json({ success: true, res: clientList });
    });
});



// POST /users/register
router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const role = req.body.role.toUpperCase();
    const password = req.body.password;


    if (!name || !surname || !phoneNumber || !email ||
        !password || !role) {
        const error = new CustomError('USER_REGISTER', req.lan);
        res.json(error);
        return;
    } else if (!(role === "OPERATOR" || role === "TEAM_BOSS")) {
        const error = new CustomError('UNKNOWN_ROLE', req.lan);
        res.json(error);
        return;
    }

    //Hash de la contraseña
    const salt = random();
    const newPass = password + salt + config.usersPepper;
    const hash = md5(newPass);

    const userInfo = req.body;
    userInfo.password = hash;
    userInfo.salt = salt;
    userInfo.role = role;


    //Cuando se crea un usuario de tipo operador se 
    //le asignan n clientes de los que no estaban asignados a ningún otro operador.
    Client.noAssignedList(config.maxClientsToOperator, (err, clientList) => {
        if (err) {
            next(err);
            return;
        }

        //Obtenemos los ids de los clientes.
        let arrayIds = clientList.map((elem, index) => {
            return elem._id;
        });
        userInfo.clientList = arrayIds;
        console.log(arrayIds);



        const user = new User(userInfo);


        user.save((err, insertedUser) => {
            //Asignamos al nuevo usuario n clientes sin asignar.
            if (err) {
                next(err);
                return;
            }
            Client.updateAssigment(insertedUser.clientList, (err, raw) => {
                //Y modificamos a los clientes para indicar que ya han sido asignados.
                if (err) {
                    next(err);
                    return;
                }
                res.json({ success: "true", "result": raw });
            });
        });
    });




});

module.exports = router;