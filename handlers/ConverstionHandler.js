
const {
  knex
} = require('../helpers');

class ConverstionHandler {

  static createNewConversation ({ title = '', type = "one_on_one" }) {
    return knex('conversations').insert({ title, type }, ['id']);
  }

  static getConversations(userId) {
    return knex('conversations')
      .join('participants', 'conversations.id', '=', 'participants.conversation_id')
      .join('users', 'participants.user_id', '=', 'users.id')
      .select('conversations.*', 'users.username', 'participants.*')
      .where('participants.user_id', userId);
  }

  static getConverstaionMessages(conversationId) {
    return knex("messages")
      .select("id", "content", "created_at", "sender_id", "send_by")
      .where("conversation_id", conversationId)
      .orderBy("created_at", "asc");
  }
}

module.exports = ConverstionHandler;
