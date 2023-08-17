const mockDb = require('mock-knex');
const { knex } = require('../helpers');
const tracker = require('mock-knex').getTracker();
const ParticipantsHandler = require('./ParticipantsHandler');

describe('ParticipantsHandler', () => {
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

  it('should create room participants', async () => {
    const participantRecords = [
      { conversation_id: 1, user_id: 2 },
      { conversation_id: 1, user_id: 3 },
    ];

    tracker.on('query', function sendResult(query) {
      expect(query.method).toBe('insert');
      const insertedRecords = [];

      for (let i = 0; i < query.bindings.length; i += 2) {
        insertedRecords.push({
          conversation_id: query.bindings[i],
          user_id: query.bindings[i + 1],
        });
      }
      expect(insertedRecords).toEqual(participantRecords);
      query.response([]);
    });

    await ParticipantsHandler.createRoomParticipant(participantRecords);
  });
});
