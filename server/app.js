'use strict';


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//Conectamos a la base de datos
require('./lib/connectMongoose');
require('./models/Client');
require('./models/User');
// require('./models/Users');

var index = require('./routes/index');
var users = require('./routes/users');
var clients = require('./routes/clients');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//En cualquier petición puede aparecer el parámetro lan que indica el idioma de los errores
app.use('/*', (req, res, next) => {
    const lan = req.query.lan;
    if (lan) {
        req.lan = lan;
    } else {
        req.lan = 'es';
    }

    next();
});

app.use('/', index);
app.use('/clients', clients);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;