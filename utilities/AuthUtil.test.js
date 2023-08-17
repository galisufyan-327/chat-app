const { bcrypt } = require('../helpers');
const AuthUtil = require('./AuthUtil');

describe('AuthUtil', () => {
  describe('validateUser', () => {
    it('should throw an exception if user is missing', () => {
      expect(() => {
        AuthUtil.validateUser(null);
      }).toThrow();
    });
    
    it('should not throw an exception if user is present', () => {
      expect(() => {
        AuthUtil.validateUser({ id: 1, email: 'test@example.com' });
      }).not.toThrow();
    });
  });
  
  describe('createHashedPassword', () => {
    it('should create a hashed password', async () => {
      const password = 'password';
      const hashedPassword = await AuthUtil.createHashedPassword(password);
      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
      expect(isPasswordMatch).toBeTruthy();
    });
  });
  

  describe('validateUserForSignUp', () => {
    it('should throw an exception if user already exists', () => {
      expect(() => {
        AuthUtil.validateUserForSignUp({ id: 1, email: 'test@example.com' });
      }).toThrow();
    });
    
    it('should not throw an exception if user does not exist', () => {
      expect(() => {
        AuthUtil.validateUserForSignUp(null);
      }).not.toThrow();
    });
  });

  describe('validateUserToAuthenticate', () => {
    it('should throw an exception if user is missing', () => {
      expect(() => {
        AuthUtil.validateUserToAuthenticate(null);
      }).toThrow();
    });
    
    it('should not throw an exception if user is present', () => {
      expect(() => {
        AuthUtil.validateUserToAuthenticate({ id: 1, email: 'test@example.com' });
      }).not.toThrow();
    });
  });

  describe('validateRefreshToken', () => {
    it('should throw an exception for expired or invalid refresh token', () => {
      const user = { id: 1, email: 'test@example.com' };
      const decoded = null; // Invalid decoded token
      expect(() => {
        AuthUtil.validateRefreshToken(user, decoded);
      }).toThrow();
    });

    it('should not throw an exception for valid refresh token', () => {
      const user = { id: 1, email: 'test@example.com' };
      const decoded = { email: 'test@example.com' };
      expect(() => {
        AuthUtil.validateRefreshToken(user, decoded);
      }).not.toThrow();
    });
  });
});
