'use strict';

//Conectamos a la base de datos
//require('../lib/connectMongoose');

const mongoose = require('mongoose');
const config = require('../config');

//Creamos un esquema
const clientSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    surname: {
        type: String
    },
    dni: {
        type: String,
        unique: true,
        index: true
    },
    phoneNumber: {
        type: Number
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    address: {
        type: String
    },
    province: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: Number
    },
    obversePath: {
        type: String
    },
    reversePath: {
        type: String
    },
    videoPath: {
        type: String
    },
    pending: {
        //True: Todavía han de revisar su vídeo y datos
        type: Boolean
    },
    assigned: {
        //True: Ya ha sido asignado a la cola de un operador
        //False: Sigue en la cola general de clientes no asignados. 
        type: Boolean
    },
    date: {
        type: Number
    }
});


clientSchema.statics.list = function(callback) {

    const query = Client.find();
    //query.limit(limt);
    //query.sort(sort);
    query.exec(callback);
}

//Este método se utiliza para poner a true el campo asignado de clientes
clientSchema.statics.updateAssigment = function(ids, callback) {
    Client.update({ _id: { "$in": ids } }, { "$set": { assigned: 'true' } }, { multi: true }, callback);
    //Client.update({}, { $set: { assigned: 'true' } }, { multi: true }, callback);
}







//Este método se utiliza para poner a true el campo asignado de clientes
clientSchema.statics.testList = function(ids, callback) {
    Client.find({ _id: { "$in": ids } }, callback);
}


//Devuelve una lista de maxClientsToOperator clientes que todavía no han sido asignados a ningún operador.
clientSchema.statics.noAssignedList = function(limit, callback) {
    const filters = {};
    filters.pending = true;
    filters.assigned = false;
    const query = Client.find(filters);
    query.limit(+limit);
    query.select('_id');
    //query.sort(sort);
    query.exec(callback);
}

var Client = mongoose.model('Client', clientSchema);