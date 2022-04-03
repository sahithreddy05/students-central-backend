var express = require("express");
var router = express.Router();

const complaintcontroller = require("../controllers/complaint");
const usercontroller = require("../controllers/user");
const authcontroller = require("../controllers/auth");

router.param("userId", usercontroller.getUserById);

router.post(
  "/postComplaint/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  complaintcontroller.postComplaint
);
router.get(
    "/getUserComplaints/:userId",
    authcontroller.isSignedIn,
    authcontroller.isAuthenticated,
    complaintcontroller.getComplaintsInd
)
router.get(
    "/getAllComplaints/:userId",
    authcontroller.isSignedIn,
    authcontroller.isAuthenticated,
    authcontroller.isAdmin,
    complaintcontroller.getAllComplaints
)
module.exports = router;
