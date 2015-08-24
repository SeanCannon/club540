'use strict';

var R         = require('ramda'),
    moment    = require('moment');

var DB                       = require('../../../utils/db/DB'),
    passwords                = require('../../../utils/passwords'),
    validateConversationData = require('../helpers/validateConversationData').validateForInsert;

var decorateDataForDbInsertion = function(conversationData) {
  var dataCopy             = R.clone(conversationData),
      SALT_ROUNDS_EXPONENT = 1;

  dataCopy.createdDate     = moment().format('YYYY-MM-DD');
  dataCopy.createdUnixTime = parseInt(moment().format('X'));
  dataCopy.hash            = passwords.makePasswordHash(dataCopy.createdUnixTime.toString(), SALT_ROUNDS_EXPONENT);

  return dataCopy;
};

var createAndExecuteQuery = function() {
  var conversationData = decorateDataForDbInsertion({});

  var fields = R.keys(conversationData);
  var query  = 'INSERT INTO messaging_conversations SET ' +
    DB.prepareProvidedFieldsForSet(fields);

  var queryStatement = [query, DB.prepareValues(conversationData)];
  return DB.query(queryStatement);
};

/**
 * Create a conversation record.
 * @param {Object} [conversationData]
 * @returns {Promise}
 */
function createConversation(conversationData) {
  validateConversationData(conversationData || {});
  return createAndExecuteQuery();
}

module.exports = createConversation;
