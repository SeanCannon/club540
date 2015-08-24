'use strict';

var api         = require('../../../lib/util/api'),
    DB          = require('../../../lib/util/db'),
    validator   = require('../../../lib/util/validator'),
    getUserById = require('./getUserById'),
    config      = require('config'),
    crypto      = require('crypto'),
    S           = require('string');

/**
 * Insert a new user
 * @param {Object} req
 * @param {Object} req.body
 * @param {Object} req.body.profile
 * @param {String} req.body.profile.firstName
 * @param {String} req.body.profile.lastName
 * @param {String} req.body.profile.nickname
 * @param {String} req.body.profile.password
 * @param {String} req.body.profile.email
 * @param {Object} req.body.geo
 * @param {Object} req.body.geo.country
 * @param {String} req.body.geo.country.abbv
 * @param {Object} req.body.geo.state
 * @param {String} req.body.geo.state.abbv
 * @param {Object} req.body.geo.location
 * @param {Number} req.body.geo.location.latitude
 * @param {Number} req.body.geo.location.longitude
 * @param {String} req.body.geo.location.city
 * @param {String} req.body.geo.location.region
 * @param {Date}   req.unrealisticBirthday Set and sent to validator
 * @param {Date}   req.nowDate             Set and sent to validator
 * @param {Number} req.statusCode Set in this method and sent with res
 * @param {*}      req.response   Set in this method and sent with res
 * @param {Array}  req.query Contains prepared statement([0]) and swap-ins ([1])
 * @param {Object} res
 */
function createUser (req, res) {

  var nowDate                   = new Date(),
      userJoinedTime            = nowDate.getTime(),
      userLastSeenTime          = userJoinedTime,
      emailVerificationNumber   = userJoinedTime * Math.floor(Math.random() * 1000),
      emailVerifiedStatus       = 0,
      commonSalt                = config.security.commonSalt,
      birthday                  = new Date(req.body.profile && req.body.profile.birthday),
      userTableColumnCount      = 22, // Update if table schema changes
      newUserRecordPolyfill     = DB.createEmptyPreparedStatementValueArray(userTableColumnCount),
      query,
      preparedValues,
      errors;

  var USER_STATUS_PENDING = 0;

  function _getSaltedPassword () {
    return req.body.profile.password + DB.createSalt(req.body.profile.nickname) + commonSalt;
  }

  function _getHashedPassword (algorithm, password) {
    return crypto.createHmac(algorithm, password).digest('hex');
  }

  query = 'INSERT INTO users ' +
          'VALUES '            +
          DB.createPreparedStatementSwapInString(userTableColumnCount);

  req.checkBody('profile.email',    'Invalid email address').isEmail();
  req.checkBody('profile.nickname', 'Invalid email address').isEmail();

  errors = validator.getUserUpsertValidationErrors(req);

  if (errors) {
    errors.forEach(function(err) {
      req.flash('error', err.msg);
    });

    req.statusCode = 500;
    req.response   = 'Validation errors';
    api.respond(req, res);
    return;
  }

  preparedValues = [
    '',

    // Profile
    req.body.profile.gender,
    S(req.body.profile.firstName).capitalize().toString(),
    S(req.body.profile.lastName).capitalize().toString(),
    req.body.profile.nickname.toLowerCase(),
    _getHashedPassword('md5', _getSaltedPassword()),

    // Email
    req.body.profile.email.toLowerCase(),
    emailVerificationNumber,
    emailVerifiedStatus,

    // Geo
    req.body.geo.location.latitude,
    req.body.geo.location.longitude,
    req.body.geo.location.elevation,
    S(req.body.geo.location.city).capitalize().toString(),
    S(req.body.geo.location.region).capitalize().toString(),
    req.body.geo.state.abbv.toUpperCase(),
    req.body.geo.country.abbv.toUpperCase(),

    // Birthday
    birthday.getMonth() + 1,
    birthday.getDate(),
    birthday.getFullYear(),

    // Meta
    userJoinedTime,
    USER_STATUS_PENDING,
    userLastSeenTime
  ];

  req.query = [query, preparedValues];

  api.upsertAndClearCache(req, res).then(function (req) {

    req.params.id = req.results.insertId;

    getUserById(req, res);

    // TODO Don't forget to insert the user_profile
  });

}

module.exports = createUser;
