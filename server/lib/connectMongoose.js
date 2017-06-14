//Módulo que hace conexión con la base de datos.

'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const conn = mongoose.connection;

conn.on('err', (err) => {
    console.log('Error de conexión', err);
    process.exit(1);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB.');
});

//realizamos la conexión
mongoose.connect('mongodb://localhost/server');

//No necesitamos exportar la conexión ya que mongoose la gestiona por nosotros
//si utilizasemos el driver si que necesitaríamos hacerlo