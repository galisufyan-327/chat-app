const mockDb = require('mock-knex');
const { knex } = require('../helpers');
const tracker = require('mock-knex').getTracker();
const UserHandler = require('./UserHandler');

describe('UserHandler', () => {
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

  it('should find a user by email', async () => {
    const email = 'test@example.com';
    const userData = { id: 1, email, username: 'testuser', password: 'hashedpassword' };

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('first');
      expect(query.bindings[0]).toBe(email);
      query.response(userData);
    });

    const user = await UserHandler.findUserByEmail(email);
    expect(user).toEqual(userData);
  });

  it('should find users except the current user by email', async () => {
    const email = 'test@example.com';
    const userData = [
      { id: 2, email: 'user2@example.com', username: 'user2', password: 'hashedpassword' },
      { id: 3, email: 'user3@example.com', username: 'user3', password: 'hashedpassword' },
    ];

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('select');
      expect(query.bindings[0]).toBe(email);
      query.response(userData);
    });

    const users = await UserHandler.findUserExceptCurrent(email);
    expect(users).toEqual(userData);
  });

  it('should create a new user', async () => {
    const userData = { email: 'newuser@example.com', name: 'newuser', password: 'hashedpassword' };
    const insertedUserData = { id: 4, ...userData };

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('insert');
      expect(query.bindings[0]).toEqual(userData.email);
      query.response([insertedUserData]);
    });

    const [newUser] = await UserHandler.createUser(userData);
    expect(newUser).toEqual(insertedUserData);
  });

});
