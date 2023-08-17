
const {
  knex
} = require('../helpers');

class ParticipantsHandler {

  static createRoomParticipant(participantRecords) {
    return knex('participants').insert(participantRecords);;
  }

}

module.exports = ParticipantsHandler;
