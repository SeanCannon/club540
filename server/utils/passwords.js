'use strict';

var bcrypt = require('bcrypt');


var SALT_ROUNDS_EXPONENT = 10;


var makePasswordHash = function(plaintextPassword, saltRoundsExponent) {
  var salt = bcrypt.genSaltSync(saltRoundsExponent || SALT_ROUNDS_EXPONENT);
  return bcrypt.hashSync(plaintextPassword, salt);
};

var passwordMatchesHash = bcrypt.compareSync;


module.exports = {
  makePasswordHash    : makePasswordHash,
  passwordMatchesHash : passwordMatchesHash
};
