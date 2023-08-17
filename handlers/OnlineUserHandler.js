const { knex } = require("../helpers");

class OnlineUserHandler {
  static addUser(userId, socketId) {
    return knex("online_users").insert({
      user_id: userId,
      socket_id: socketId,
      last_activity: new Date(),
    });
  }

  static removeUser(socketId) {
    return knex("online_users").where("socket_id", socketId).del();
  }

  static getUserSocketId(userId) {
    return knex("online_users")
      .select("socket_id")
      .where("user_id", userId)
      .first();
  }
}

module.exports = OnlineUserHandler;
