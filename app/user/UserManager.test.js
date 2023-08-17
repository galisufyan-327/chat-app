const UserManager = require("./UserManager");
const {
  UserHandler,
  ConverstionHandler,
  ParticipantsHandler,
  MessageHandler,
} = require("../../handlers");
const { UserUtil } = require("../../utilities");

jest.mock("../../handlers");
jest.mock("../../utilities/UserUtil");
jest.mock("../../middleware/Socket");
jest.mock('../../middleware/Socket', () => ({
  io: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
}));

describe("UserManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should transform user data and return user", () => {
    const user = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
    };
    const transformedUser = { id: 1, email: "test@example.com" };

    UserUtil.transformUserData.mockReturnValue(transformedUser);

    const result = UserManager.getUser(user);

    expect(result).toEqual(transformedUser);
    expect(UserUtil.transformUserData).toHaveBeenCalledWith(user);
  });

  it("should get all users except current user", async () => {
    const email = "test@example.com";
    const users = [
      {
        id: 2,
        email: "user2@example.com",
        username: "user2",
        password: "hashedpassword",
      },
      {
        id: 3,
        email: "user3@example.com",
        username: "user3",
        password: "hashedpassword",
      },
    ];
    const transformedUsers = [
      { email: "user2@example.com", id: 2 },
      { email: "user3@example.com", id: 3 },
    ];

    UserHandler.findUserExceptCurrent.mockResolvedValue(users);
    UserUtil.transformUsersData.mockReturnValue(transformedUsers);

    const result = await UserManager.getAllUsers({ email });

    expect(result).toEqual(transformedUsers);
    expect(UserHandler.findUserExceptCurrent).toHaveBeenCalledWith(email);
    expect(UserUtil.transformUsersData).toHaveBeenCalledWith(users, true);
  });

  it("should start a conversation and create participants", async () => {
    const participants = [2, 3];
    const title = "Test Conversation";
    const type = "group";
    const currentUserId = 1;
    const conversationId = 1;

    ConverstionHandler.createNewConversation.mockResolvedValue([
      { id: conversationId },
    ]);
    ParticipantsHandler.createRoomParticipant.mockResolvedValue([]);

    await UserManager.startConverstaion(
      { participants, title, type },
      { id: currentUserId }
    );

    expect(ConverstionHandler.createNewConversation).toHaveBeenCalledWith({
      title,
      type,
    });
    expect(ParticipantsHandler.createRoomParticipant).toHaveBeenCalledWith([
      { conversation_id: conversationId, user_id: 2 },
      { conversation_id: conversationId, user_id: 3 },
      { conversation_id: conversationId, user_id: currentUserId },
    ]);
  });

  it("should get conversations for a user", async () => {
    const userId = 1;
    const conversations = [
      { id: 1, title: "Conversation 1", type: "one_on_one" },
      { id: 2, title: "Conversation 2", type: "group" },
    ];

    ConverstionHandler.getConversations.mockResolvedValue(conversations);

    const result = await UserManager.getConversations({ id: userId });

    expect(result).toEqual(conversations);
    expect(ConverstionHandler.getConversations).toHaveBeenCalledWith(userId);
  });

  it("should get conversation details", async () => {
    const conversationId = 1;
    const messages = [
      { id: 1, content: "Hello", sender_id: 2, send_by: "user123" },
      { id: 2, content: "Hi", sender_id: 1, send_by: "user456" },
    ];

    ConverstionHandler.getConverstaionMessages.mockResolvedValue(messages);

    const result = await UserManager.getConverstaionDetail(conversationId);

    expect(result).toEqual(messages);
    expect(ConverstionHandler.getConverstaionMessages).toHaveBeenCalledWith(
      conversationId
    );
  });

  it("should send a message and emit event", async () => {
    const content = "Hello";
    const senderId = 1;
    const conversationId = 1;
    const sendBy = "user123";

    const messageData = {
      content,
      sender_id: senderId,
      send_by: sendBy,
      conversation_id: conversationId,
    };
    const insertedMessage = { id: 1, ...messageData };

    MessageHandler.saveMessageDetails.mockResolvedValue([insertedMessage]);

    const mockToFn = jest.fn().mockReturnThis();
    const mockEmitFn = jest.fn();
    const mockSocket = {
      to: mockToFn,
      emit: mockEmitFn,
    };
    require("../../middleware/Socket").io = {
      to: mockToFn,
      emit: mockEmitFn,
    };

    await UserManager.sendMessage({
      content,
      senderId,
      conversationId,
      sendBy,
    });

    expect(MessageHandler.saveMessageDetails).toHaveBeenCalledWith(messageData);
    expect(mockEmitFn).toHaveBeenCalledWith("message", insertedMessage);
  });
});
