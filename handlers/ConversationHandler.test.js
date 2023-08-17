const mockDb = require('mock-knex');
const { knex } = require('../helpers');
const tracker = require('mock-knex').getTracker();
const ConverstionHandler = require('./ConverstionHandler');

describe('ConverstionHandler', () => {
  beforeEach(() => {
    tracker.install();
  });

  afterEach(() => {
    tracker.uninstall();
  });

  beforeAll(() => {
    mockDb.mock(knex);
  });

  afterAll(() => {
    mockDb.unmock(knex);
  });

  it('should create a new conversation', async () => {
    const conversationData = { title: 'Test Conversation', type: 'group' };
    const insertedConversationData = { id: 1, ...conversationData };

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('insert');
      expect(query.bindings[0]).toEqual(conversationData.title);
      query.response([insertedConversationData]);
    });

    const [newConversation] = await ConverstionHandler.createNewConversation(conversationData);
    expect(newConversation).toEqual(insertedConversationData);
  });

  it('should get conversations for a user', async () => {
    const userId = 1;
    const conversationsData = [
      {
        id: 1,
        title: 'Conversation 1',
        type: 'one_on_one',
        user_id: userId,
        socket_id: 'abc123'
      },
      {
        id: 2,
        title: 'Conversation 2',
        type: 'group',
        user_id: userId,
        socket_id: 'def456'
      },
    ];

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('select');
      expect(query.bindings[0]).toBe(userId);
      query.response(conversationsData);
    });

    const conversations = await ConverstionHandler.getConversations(userId);
    expect(conversations).toEqual(conversationsData);
  });

  it('should get conversation messages', async () => {
    const conversationId = 1;
    const messagesData = [
      { id: 1, content: 'Message 1', created_at: '2023-08-01 12:00:00', sender_id: 1, send_by: 'user123' },
      { id: 2, content: 'Message 2', created_at: '2023-08-01 12:15:00', sender_id: 2, send_by: 'user456' },
    ];

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('select');
      expect(query.bindings[0]).toBe(conversationId);
      query.response(messagesData);
    });

    const messages = await ConverstionHandler.getConverstaionMessages(conversationId);
    expect(messages).toEqual(messagesData);
  });
});
