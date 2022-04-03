var express = require("express");
var router = express.Router();

const authcontroller = require("../controllers/auth");
const usercontroller = require("../controllers/user");
const certcontroller = require("../controllers/certificate");

router.param("userId", usercontroller.getUserById);
router.param("userRoll", usercontroller.getUserByRoll);

router.post(
  "/postcert/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  certcontroller.postCertificate
);

router.get(
  "/getcertbyid/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  certcontroller.getCertsInd
);

router.get(
  "/getcertbyroll/:userId/:userRoll",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isAdmin,
  certcontroller.getCertsByRoll
);

router.get(
  "/getallcerts/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isAdmin,
  certcontroller.getAllCerts
);

module.exports = router;
