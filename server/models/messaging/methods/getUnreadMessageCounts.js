'use strict';

var Validator = require('o-validator'),
    prr       = require('prettycats');

var DB = require('../../../utils/db/DB');

var MESSAGE_STATE_UNREAD = 0;

var validateRecipientId = Validator.validateOrThrow({
  cloudUserIdRecipient : Validator.required(prr.isPositiveNumber)
});

var createAndExecuteQuery = function(cloudUserIdRecipient) {
  var query = 'SELECT COUNT(id) current_box AS unreadCount, FROM messaging_messages WHERE cloud_user_id_recipient = 1 AND state = 0 GROUP BY current_box',
      queryStatement = [query, [cloudUserIdRecipient, MESSAGE_STATE_UNREAD]];

  return DB.query(queryStatement);
};

/**
 * Query the counts for unread messages for the provided cloud user.
 * @param {Number} cloudUserIdRecipient
 * @returns {Promise}
 */
function getUnreadMessageCounts(cloudUserIdRecipient) {
  validateRecipientId({cloudUserIdRecipient : cloudUserIdRecipient});
  return createAndExecuteQuery(cloudUserIdRecipient);
}

module.exports = getUnreadMessageCounts;
