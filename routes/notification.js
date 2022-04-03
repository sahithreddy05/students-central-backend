var express = require("express");
var router = express.Router();

const usercontroller = require("../controllers/user");
const authcontroller = require("../controllers/auth");
const notificationcontroller = require("../controllers/notification");

router.param("userId", usercontroller.getUserById);
router.param("noteId", notificationcontroller.getNotificationById);

router.post(
  "/postnotification/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isAdmin,
  notificationcontroller.postNotification
);

router.get(
  "/getallnotifications/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  notificationcontroller.getAllNotifications
);

router.delete(
  "/deletenotification/:noteId/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isAdmin,
  notificationcontroller.deleteNotification
);

module.exports = router;
