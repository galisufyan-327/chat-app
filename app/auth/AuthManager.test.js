const { UserHandler } = require('../../handlers');
const { Token, bcrypt } = require('../../helpers');
const { AuthUtil } = require('../../utilities');
const AuthManager = require('./AuthManager')

jest.mock('../../handlers/UserHandler');
jest.mock('../../helpers');
jest.mock('../../utilities/AuthUtil');
jest.mock('../../helpers/Token');

describe('AuthManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it("should sign up a new user", async () => {
      const signupData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      };

      UserHandler.findUserByEmail.mockResolvedValue(null);
      AuthUtil.validateSignUpRequest.mockReturnValue();
      AuthUtil.createHashedPassword.mockResolvedValue("hashedpassword");
      UserHandler.createUser.mockResolvedValue([{ id: 1, ...signupData }]);
      UserHandler.setAccessToken.mockResolvedValue([{ id: 1, ...signupData }]);

      const result = await AuthManager.signup(signupData);

      expect(UserHandler.findUserByEmail).toHaveBeenCalledWith(
        signupData.email
      );
      expect(AuthUtil.validateSignUpRequest).toHaveBeenCalledWith(signupData);
      expect(AuthUtil.createHashedPassword).toHaveBeenCalledWith("password123");
      expect(UserHandler.createUser).toHaveBeenCalledWith({
        email: signupData.email,
        name: signupData.name,
        password: "hashedpassword",
      });

      delete signupData.password

      expect(result).toEqual({ id: 1, ...signupData });
    });

  });

  describe('login', () => {
    it('should log in a user with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userData = {
        id: 1,
        email: loginData.email,
        password: 'hashedpassword',
      };

      UserHandler.findUserByEmail.mockResolvedValue(userData);
      AuthUtil.validateLoginRequest.mockReturnValue();
      bcrypt.compare.mockResolvedValue(true);
      Token.getLoginToken.mockReturnValue('access_token');
      Token.getRefreshToken.mockReturnValue('refresh_token');

      const result = await AuthManager.login(loginData);

      expect(UserHandler.findUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(AuthUtil.validateLoginRequest).toHaveBeenCalledWith(loginData);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, userData.password);
      expect(Token.getLoginToken).toHaveBeenCalledWith(userData);
      expect(Token.getRefreshToken).toHaveBeenCalledWith(userData);
      expect(UserHandler.setAccessToken).toHaveBeenCalledWith(userData.id, 'access_token', 'refresh_token');
      expect(result).toEqual({
        id: 1,
        email: loginData.email,
        name: "Test User",
      });
    });

  });

  describe('refreshToken', () => {
    it('should refresh the user token with valid refresh token', async () => {
      const user = { id: 1, email: 'test@example.com' };
      const refreshTokenData = {
        refresh_token: 'valid_refresh_token',
      };
      const decodedToken = {
        email: user.email,
      };

      AuthUtil.validateRefreshTokenRequest.mockReturnValue();
      Token.verifyToken.mockReturnValue(decodedToken);
      AuthUtil.validateRefreshToken.mockReturnValue();
      Token.getLoginToken.mockReturnValue('new_access_token');
      Token.getRefreshToken.mockReturnValue('new_refresh_token');
      UserHandler.setAccessToken.mockResolvedValue([{ id: 1, email: user.email }]);

      const result = await AuthManager.refreshToken(user, refreshTokenData);

      expect(AuthUtil.validateRefreshTokenRequest).toHaveBeenCalledWith(refreshTokenData);
      expect(AuthUtil.validateRefreshToken).toHaveBeenCalledWith(user, decodedToken);
      expect(Token.getLoginToken).toHaveBeenCalledWith(user);
      expect(Token.getRefreshToken).toHaveBeenCalledWith(user);
      expect(UserHandler.setAccessToken).toHaveBeenCalledWith(
        user.id,
        "new_access_token",
        "new_refresh_token"
      );
      expect(result).toEqual({ id: 1, email: user.email });
    });

  });

  describe("setAccessToken", () => {
    it("should set access token for a user", async () => {
      const user = { id: 1, email: "test@example.com" };
      const accessToken = "access_token";
      const refreshToken = "refresh_token";

      Token.getLoginToken.mockReturnValue(accessToken);
      Token.getRefreshToken.mockReturnValue(refreshToken);
      UserHandler.setAccessToken.mockResolvedValue([
        { id: 1, email: user.email },
      ]);

      const result = await AuthManager.setAccessToken(user);

      expect(Token.getLoginToken).toHaveBeenCalledWith(user);
      expect(Token.getRefreshToken).toHaveBeenCalledWith(user);
      expect(UserHandler.setAccessToken).toHaveBeenCalledWith(
        user.id,
        accessToken,
        refreshToken
      );
      expect(result).toEqual({ id: 1, email: user.email });
    });
  });

});
