'use strict';

module.exports = {
  createConversation     : require('./methods/createConversation'),
  getConversationByHash  : require('./methods/getConversationByHash'),
  createMessage          : require('./methods/createMessage'), // TODO sendMessage should be a controller method which calls this and then does something with rabbit or socket.io
  getMessageByHash       : require('./methods/getMessageByHash'),
  getMessagesForBox      : require('./methods/getMessagesForBox'),
  getUnreadMessageCounts : require('./methods/getUnreadMessageCounts'),
  markMessagesAsRead     : require('./methods/markMessagesAsRead'),
  markMessagesAsUnread   : require('./methods/markMessagesAsUnread'),
  moveMessages           : require('./methods/moveMessages'),
  userIsMessageRecipient : require('./methods/userIsMessageRecipient'),
  userIsInConversation   : require('./methods/userIsInConversation')
};
