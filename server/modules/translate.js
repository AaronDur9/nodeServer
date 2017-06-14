'use strict';

const fs = require('fs');

let errorJson = '';

function initErrors() {
    const fichero = './lib/errors.json';
    fs.readFile(fichero, 'utf-8', function(err, datos) {
        if (err) {
            console.log('Error al cargar el json');
            return;
        }

        errorJson = JSON.parse(datos);


    });
}


//Devuelve el error con clave key en el idioma especificado
function getError(key, language) {
    return errorJson[key][language];
}

initErrors();

module.exports = getError;