/*jslint node: true */
'use strict';

var express          = require('express'),
    config           = require('config'),
    session          = require('express-session'),
    path             = require('path'),
    flash            = require('connect-flash'),
    setFlash         = require('./middleware/flash.js'),
    favicon          = require('serve-favicon'),
    fs               = require('fs'),
    passport         = require('passport'),
    cookieParser     = require('cookie-parser'),
    bodyParser       = require('body-parser'),
    validator        = require('express-validator'),
    routes           = require('./routes/index'), // TODO concat this with cloud-service specific routes
    //auth             = require('./routes/auth'),
    //userAPI          = require('./routes/api/user'),
    //geoAPI           = require('./routes/api/geo'),
    tricksAPI        = require('./routes/api/tricktionary'),
    accessLogStream  = fs.createWriteStream(__dirname + '/access.log', {
      flags : 'a' // Append mode
    }),
    app              = express(),
    server           = require('http').createServer(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : false
}));
app.use(cookieParser('4037snake'));
app.use(session({
  secret            : '4037snake',
  resave            : false,
  saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

// TODO THIS IS NOT WORKING!!!! MAKE DIRECTORY INDEX WORK!
app.use (express.static( './dist'));
app.use(setFlash);

app.use('/', routes);
app.use('/users', routes);
app.use('/tricktionary', routes);
app.use('/chat', routes);
app.use('/socket.io', routes);

//app.use('/auth', auth);
//
//app.use('/api/users',  userAPI);
//app.use('/api/user',   userAPI);
//app.use('/api/geo',    geoAPI);
app.use('/api/tricktionary', tricksAPI);
app.use('/api/trick',  tricksAPI);
app.use('/api/tricks', tricksAPI);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message : err.message,
      error   : err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/error', {
    message : err.message,
    error   : {}
  });
});

app.listen(config.port);

console.log('Listening on ' + process.env.NODE_ENV + ' : ' + config.port);

module.exports = app;
