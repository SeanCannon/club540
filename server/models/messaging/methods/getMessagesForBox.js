'use strict';

var Validator = require('o-validator'),
    prr       = require('prettycats');

var DB = require('../../../utils/db/DB');

var CURRENT_BOX_INBOX = 'INBOX';

var validateMessageData = Validator.validateOrThrow({
  cloudUserIdRecipient : Validator.required(prr.isPositiveNumber),
  messageBox           : prr.isStringOfLengthAtMost(20)
});

var createAndExecuteQuery = function(cloudUserIdRecipient, messageBox) {
  var query = 'SELECT * FROM messaging_messages WHERE cloud_user_id_recipient = ? ' +
              'AND current_box = ? ',
      queryStatement = [query, [cloudUserIdRecipient, messageBox]];

  return DB.query(queryStatement);
};

/**
 * Fetch messages in specified messageBox or INBOX
 * @param {Number} cloudUserIdRecipient
 * @param {String} [messageBox]
 * @returns {Promise}
 */
function getMessagesForBox(cloudUserIdRecipient, messageBox) {

  messageBox = messageBox || CURRENT_BOX_INBOX;

  validateMessageData({
    cloudUserIdRecipient : cloudUserIdRecipient,
    messageBox           : messageBox
  });

  return createAndExecuteQuery(cloudUserIdRecipient, messageBox);
}

module.exports = getMessagesForBox;
