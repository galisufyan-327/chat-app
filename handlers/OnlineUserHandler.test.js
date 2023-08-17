const mockDb = require('mock-knex');
const { knex } = require('../helpers');
const tracker = require('mock-knex').getTracker();
const OnlineUserHandler = require('./OnlineUserHandler');

describe('OnlineUserHandler', () => {
  beforeEach(() => {
    tracker.install()
  })

  afterEach(() => {
    tracker.uninstall()
  })
  beforeAll(() => {
    mockDb.mock(knex);
  });

  afterAll(() => {
    mockDb.unmock(knex);
  });

  it('should add a user to the online_users table', async () => {
    const userId = 1;
    const socketId = 'abc123';
  
    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('insert');
      const insertedRows = query.bindings;
      expect(insertedRows[2]).toBe(userId);
      expect(insertedRows[1]).toBe(socketId);
      query.response([]);
    });
  
    await OnlineUserHandler.addUser(userId, socketId);
  });

  it('should remove a user from the online_users table', async () => {
    const socketId = 'abc123';

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('del');
      expect(query.bindings[0]).toBe(socketId);
      query.response([]);
    });

    await OnlineUserHandler.removeUser(socketId);
  });

  it('should get a user\'s socketId from the online_users table', async () => {
    const userId = 1;
    const expectedSocketId = 'abc123';

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('first');
      expect(query.bindings[0]).toBe(userId);
      query.response({ socket_id: expectedSocketId });
    });

    const response = await OnlineUserHandler.getUserSocketId(userId);
    expect(response.socket_id).toBe(expectedSocketId);
  });
});
