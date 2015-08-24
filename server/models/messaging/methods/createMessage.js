'use strict';

var R      = require('ramda'),
    moment = require('moment');

var DB                  = require('../../../utils/db/DB'),
    passwords           = require('../../../utils/passwords'),
    validateMessageData = require('../helpers/validateMessageData').validateForInsert;

var decorateDataForDbInsertion = function(messageData) {
  var dataCopy             = R.clone(messageData),
      SALT_ROUNDS_EXPONENT = 1;

  dataCopy.createdDate     = moment().format('YYYY-MM-DD');
  dataCopy.createdUnixTime = parseInt(moment().format('X'));
  dataCopy.hash            = passwords.makePasswordHash(dataCopy.createdUnixTime.toString(), SALT_ROUNDS_EXPONENT);

  return dataCopy;
};

var createAndExecuteQuery = function() {
  var messageData = decorateDataForDbInsertion({});

  var fields = R.keys(messageData);
  var query  = 'INSERT INTO messaging_messages SET ' +
    DB.prepareProvidedFieldsForSet(fields);

  var queryStatement = [query, DB.prepareValues(messageData)];
  return DB.query(queryStatement);
};

/**
 * Create a message record.
 * @param {Object} messageData
 * @returns {Promise}
 */
function createMessage(messageData) {
  validateMessageData(messageData || {});
  return createAndExecuteQuery(messageData);
}

module.exports = createMessage;
