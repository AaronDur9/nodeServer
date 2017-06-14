'use strict';

//Conectamos a la base de datos
//require('../lib/connectMongoose');

const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Client = mongoose.model('Client');

//Creamos un esquema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    surname: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    role: {
        type: String,
        index: true
    },
    phoneNumber: {
        type: Number
    },
    clientList: [{
        type: Schema.ObjectId,
        ref: "Client"
    }],
    password: {
        type: String
    },
    salt: {
        type: Number
    }
});


userSchema.statics.list = function(callback) {

    const query = user.find();
    //query.limit(limt);
    //query.sort(sort);
    query.exec(callback);
}


var User = mongoose.model('User', userSchema);