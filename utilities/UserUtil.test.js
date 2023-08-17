const { Exception } = require("../helpers");
const UserUtil = require("./UserUtil");

describe('UserUtil', () => {
  describe('transformUsersData', () => {
    it('should transform an array of users', () => {
      const users = [
        { id: 1, name: 'User 1', refresh_token: 'token', password: 'password' },
        { id: 2, name: 'User 2', refresh_token: 'token', password: 'password' }
      ];
      
      const transformedUsers = UserUtil.transformUsersData(users, true);
      
      expect(transformedUsers).toHaveLength(2);
      expect(transformedUsers[0]).not.toHaveProperty('refresh_token');
      expect(transformedUsers[0]).not.toHaveProperty('password');
      expect(transformedUsers[1]).not.toHaveProperty('refresh_token');
      expect(transformedUsers[1]).not.toHaveProperty('password');
    });
    
    it('should return an empty array if input is empty', () => {
      const transformedUsers = UserUtil.transformUsersData([], true);
      
      expect(transformedUsers).toEqual([]);
    });
  });
  
  describe('validateRequestForConversation', () => {
    it('should throw an exception for empty participants', () => {
      const participants = [];
      
      expect(() => {
        UserUtil.validateRequestForConversation(participants);
      }).toThrow();
      
    });
  });

  describe('validateRequestForMessage', () => {
    it('should throw an exception for missing fields', () => {
      const content = 'Hello';
      const senderId = 1;
      const conversationId = null;
      const sendBy = 'user123';

      expect(() => {
        UserUtil.validateRequestForMessage(content, senderId, conversationId, sendBy);
      }).toThrow();

    });

  });

  describe('transformUserData', () => {
    it('should transform a user by removing sensitive fields', () => {
      const user = {
        id: 1,
        name: 'User 1',
        refresh_token: 'token',
        password: 'password'
      };
      
      const transformedUser = UserUtil.transformUserData(user, true);
      
      expect(transformedUser).not.toHaveProperty('refresh_token');
      expect(transformedUser).not.toHaveProperty('password');
    });

    it('should return the same user if deleteAccess is false', () => {
      const user = {
        id: 1,
        name: 'User 1',
        access_token: 'token',
        password: 'password'
      };
      
      const transformedUser = UserUtil.transformUserData(user, false);
      
      expect(transformedUser).toHaveProperty('access_token', 'token');
    });
    
    it('should return null if input user is falsy', () => {
      const transformedUser = UserUtil.transformUserData(null, true);
      
      expect(transformedUser).toBeNull();
    });
  });
  
  describe('updateUserData', () => {
    it('should transform a user by removing password', () => {
      const user = {
        id: 1,
        name: 'User 1',
        password: 'password'
      };
      
      const updatedUser = UserUtil.updateUserData(user);
      
      expect(updatedUser).not.toHaveProperty('password');
    });
    
    it('should return null if input user is falsy', () => {
      const updatedUser = UserUtil.updateUserData(null);
      
      expect(updatedUser).toBeNull();
    });
  });
  
  describe('createReturnData', () => {
    it('should create return data object with user property', () => {
      const user = { id: 1, name: 'User 1' };
      const returnData = UserUtil.createReturnData(user);
      
      expect(returnData).toHaveProperty('user', user);
    });
  });



});
