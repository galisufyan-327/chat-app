const express = require("express");

const { Authentication } = require("../middleware");
const UserController = require("../app/user/UserController");
const USERS_ROUTES_PREFIX = "/users";

const router = express.Router();

router.get(
  `${USERS_ROUTES_PREFIX}/me`,
  Authentication.authenticate,
  UserController.getUser
);


router.get(
  `${USERS_ROUTES_PREFIX}`,
  Authentication.authenticate,
  UserController.getAllUser
);

router.post(
  `${USERS_ROUTES_PREFIX}/new-conversation`,
  Authentication.authenticate,
  UserController.startNewConversation
);


router.get(
  `${USERS_ROUTES_PREFIX}/conversations`,
  Authentication.authenticate,
  UserController.getConversations
);

router.get(
  `${USERS_ROUTES_PREFIX}/conversations/:conversationId`,
  Authentication.authenticate,
  UserController.getConverstaionDetail
);

router.post(
  `${USERS_ROUTES_PREFIX}/conversations/send-message`,
  Authentication.authenticate,
  UserController.sendMessage
);

module.exports = router;
