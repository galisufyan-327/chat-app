const UserManager = require("./UserManager");

const { ErrorCodes, UserConstants } = require("../../constants");
const { Validators } = require("../../helpers");

class UserController {
  static async getUser(req, res) {
    try {
      const user = await UserManager.getUser(req.user);

      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.log(
        `getUser:: Request to fetch user failed. userId:: ${
          req.user.id
        } user:: ${req.user.email} params:: ${JSON.stringify(req.params)}`,
        err
      );

      return res
        .status(
          Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) ||
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : UserConstants.MESSAGES.FETCHING_USER_FAILED,
        });
    }
  }

  static async getAllUser(req, res) {
    try {
      const users = await UserManager.getAllUsers(req.user);

      res.json({
        success: true,
        users,
      });
    } catch (err) {
      console.log(
        `getUser:: Request to fetch user failed. userId:: ${
          req.user.id
        } user:: ${req.user.email} params:: ${JSON.stringify(req.params)}`,
        err
      );

      return res
        .status(
          Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) ||
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : UserConstants.MESSAGES.FETCHING_USER_FAILED,
        });
    }
  }

  static async startNewConversation(req, res) {
    try {
      await UserManager.startConverstaion(req.body, req.user);

      res.json({
        success: true,
      });
    } catch (err) {
      console.log(
        `getUser:: Request to create converstaion failed. userId:: ${
          req.user.id
        } user:: ${req.user.email} params:: ${JSON.stringify(req.params)}`,
        err
      );

      return res
        .status(
          Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) ||
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : UserConstants.MESSAGES.START_CONVERSATION_FAILED,
        });
    }
  }

  static async getConversations(req, res) {
    try {
      const conversations = await UserManager.getConversations(req.user);

      res.json({
        success: true,
        conversations
      });
    } catch (err) {
      console.log(
        `getUser:: Request to fetch converstaion failed. userId:: ${
          req.user.id
        } user:: ${req.user.email} params:: ${JSON.stringify(req.params)}`,
        err
      );

      return res
        .status(
          Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) ||
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : UserConstants.MESSAGES.FETCH_CONVERSATION_FAILED,
        });
    }
  }

  static async getConverstaionDetail(req, res) {
    try {
      const { conversationId } = req.params;

      const messages = await UserManager.getConverstaionDetail(conversationId);

      res.json({
        success: true,
        messages
      });
    } catch (err) {
      console.log(
        `getUser:: Request to fetch converstaion failed. userId:: ${
          req.user.id
        } user:: ${req.user.email} params:: ${JSON.stringify(req.params)}`,
        err
      );

      return res
        .status(
          Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) ||
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : UserConstants.MESSAGES.FETCH_CONVERSATION_FAILED,
        });
    }
  }

  static async sendMessage(req, res) {
    try {
      await UserManager.sendMessage(req.body);

      res.json({
        success: true
      });
    } catch (err) {
      console.log(
        `getUser:: Request to send message failed. userId:: ${
          req.user.id
        } user:: ${req.user.email} params:: ${JSON.stringify(req.body)}`,
        err
      );

      return res
        .status(
          Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) ||
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : UserConstants.MESSAGES.SEND_MESSAGE_FAILED,
        });
    }
  }
}

module.exports = UserController;
