const { knex } = require("../helpers");

class ConverstionHandler {
  static createNewConversation({ title = "", type = "one_on_one" }) {
    return knex("conversations").insert({ title, type }, ["id"]);
  }

  static getConversations(userId) {
    const subquery = knex("participants")
      .distinct("conversation_id")
      .where("user_id", userId)
      .as("user_conversations");

    return knex("conversations")
      .select("conversations.*")
      .select(
        knex.raw(
          `JSON_AGG(
            json_build_object('user_id', participants.user_id, 'username', users.username, 'conversation_id', participants.conversation_id, 'created_at', participants.created_at, 'participant_id', participants.participant_id, 'updated_at', participants.updated_at
          ))
          as participants`
        )
      )
      .join(
        "participants",
        "conversations.id",
        "=",
        "participants.conversation_id"
      )
      .leftJoin("users", "participants.user_id", "=", "users.id")
      .join(
        subquery,
        "conversations.id",
        "=",
        "user_conversations.conversation_id"
      )
      .groupBy("conversations.id");
  }

  static getConversationById(id) {
    return knex("conversations")
      .select("conversations.*")
      .select(
        knex.raw(
          `JSON_AGG(
            json_build_object('user_id', participants.user_id, 'username', users.username, 'conversation_id', participants.conversation_id, 'created_at', participants.created_at, 'participant_id', participants.participant_id, 'updated_at', participants.updated_at
          ))
          as participants`
        )
      )
      .join(
        "participants",
        "conversations.id",
        "=",
        "participants.conversation_id"
      )
      .leftJoin("users", "participants.user_id", "=", "users.id")
      .where("conversations.id", id)
      .groupBy("conversations.id")
      .first();
  }

  static getConverstaionMessages(conversationId) {
    return knex("messages")
      .select("id", "content", "created_at", "sender_id", "send_by")
      .where("conversation_id", conversationId)
      .orderBy("created_at", "asc");
  }
}

module.exports = ConverstionHandler;
