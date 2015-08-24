/*jslint node: true */
'use strict';

var express       = require('express'),
    router        = express.Router(),
    mysql         = require('mysql'),
    config        = require('config'),
    passport      = require('passport'),
    passportFB    = require('passport-facebook'),
    LocalStrategy = require('passport-local').Strategy,
    dbPool        = mysql.createPool(config.mysql),
    redis         = require('redis'),
    redisClient   = redis.createClient(),

    localSignup,
    localLogin;

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
  dbPool.getConnection(function (err, connection) {
    connection.query('SELECT * FROM users WHERE user_id = ?', [id], function (err, results) {
      done(err, results[0]);
      connection.release();
    });
  });
});

// @todo This needs tweaking because we will also pass in all that GEO stuff

/**
 * Use local strategy to register a user.
 * @type {LocalStrategy}
 */
localSignup = new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField     : 'user_nickname',
      passwordField     : 'user_password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    /**
     * Attempt to signup a user.
     * @param req
     * @param username
     * @param password
     * @param done
     */
    function (req, username, password, done) {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      dbPool.getConnection(function (err, connection) {

        connection.query('SELECT id FROM users WHERE user_nickname LIKE ?', [username], function (err, results) {

          if (err) {
            return done(err);
          }

          if (results.length) {
            return done(null, false, req.flash('error', 'That username is already taken.'));
          } else {

            // if there is no user with that email
            // create the user
            var newUserMysql = {
                  username : username,
                  password : password
                },
                query = 'INSERT INTO users (email, password) ' +
                        'VALUES (?, ?)';

            console.warn('DONT FORGET THE GEO STUFF!!');

            connection.query(query, [username, password], function (err, rows) {
              newUserMysql.id = rows.insertId;

              return done(null, newUserMysql);
            });
          }
          connection.release();
        });

      }); // End dbPool.getConnection()

    });
passport.use('local-signup', localSignup);

/**
 * Use local strategy to login a user.
 * @type {LocalStrategy}
 */
localLogin = new LocalStrategy({
      usernameField     : 'user_nickname',
      passwordField     : 'user_password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    /**
     * Attempt to find and login the user with provided credentials.
     * @param req
     * @param username
     * @param password
     * @param done
     */
    function (req, username, password, done) { // callback with email and password from our form
      dbPool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM users WHERE user_nickname LIKE ?', [username], function (err, results) {
          if (err) {
            return done(err);
          }
          if (!results.length) {
            console.warn('no results length.. username = ', username, 'password = ', password);

            return done(null, false, req.flash('error', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
          }

          // if the user is found but the password is wrong
          if (results[0].user_password !== password) {
            return done(null, false, req.flash('error', 'Oops! Wrong password.'));
          } // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, results[0], req.flash('notice', 'Logged in as ' + results[0].user_nickname));

        });
      });

    });
passport.use('local-login', localLogin);

router.post('/login', function (req, res) {

  passport.authenticate('local-login', function (err, user, info) {
    var response = {
      status   : 200,
      response : {
        user  : user,
        error : err,
        info  : info
      },
      flash    : {
        notice : req.flash('notice'),
        error  : req.flash('error')
      }
    };

    res.locals.flash = response.flash;
    res.json(response);

  })(req, res);
});

module.exports = router;
