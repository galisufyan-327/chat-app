const { UserUtil } = require('../../utilities') 
const { UserHandler, ConverstionHandler, ParticipantsHandler, MessageHandler } = require('../../handlers');
const { transformUsersData } = require('../../utilities/UserUtil');
const Socket = require('../../middleware/Socket');

class UserManager {
  static getUser(user) {
    user = UserUtil.transformUserData(user);

    console.log(
      `getUser:: User's data successfully fetched. userId::${user.id} user:: ${user.email}`
    );

    return user;
  }

  static async getAllUsers({ email }) {
    const users = await UserHandler.findUserExceptCurrent(email);

    return transformUsersData(users, true);
  }

  static async startConverstaion(
    { participants, title, type },
    { id: currentUserId }
  ) {
    UserUtil.validateRequestForConversation(participants);

    const [converstaion] = await ConverstionHandler.createNewConversation({
      title,
      type,
    });

    const participantRecords = participants.map((userId) => ({
      conversation_id: converstaion.id,
      user_id: userId,
    }));

    participantRecords.push({
      user_id: currentUserId,
      conversation_id: converstaion.id,
    });

    await ParticipantsHandler.createRoomParticipant(participantRecords);
  }

  static async getConversations({ id }) {
    return ConverstionHandler.getConversations(id);
  }

  static async getConverstaionDetail(conversationId) {
    return ConverstionHandler.getConverstaionMessages(conversationId);
  }

  static async sendMessage({ content, senderId, conversationId, sendBy }) {

    UserUtil.validateRequestForMessage(content, senderId, conversationId, sendBy);

    const data = {
      content,
      sender_id: senderId,
      send_by: sendBy,
      conversation_id: conversationId,
    }

    const [response] = await MessageHandler.saveMessageDetails(data);

    console.log(response)

    Socket.io.to(conversationId).emit("message", response)

  }
}

module.exports = UserManager;