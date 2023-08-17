
const { knex } = require("../helpers");

class MessageHandler {
  static saveMessageDetails(data) {
    return knex('messages').insert({
      ...data,
    }, ['*'])
  }
}

module.exports = MessageHandler;
