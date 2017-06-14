'use strict';

const translate = require('./translate.js');

//Le pasamos la clave del error
//Con esto llama a translate y coge el mensaje de error en el idioma indicado
//Y esto es lo que coloca en la variable message
function CustomError(key, language) {
    this.success = false;
    this.errorKey = key;
    this.errorMessage = translate(key, language);
}

module.exports = CustomError;