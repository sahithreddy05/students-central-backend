var express = require("express");
var router = express.Router();

const itemcontroller = require("../controllers/item");
const usercontroller = require("../controllers/user");
const authcontroller = require("../controllers/auth");

router.param("userId", usercontroller.getUserById);
router.param("itemId", itemcontroller.getItemById);

router.post(
  "/postItem/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  itemcontroller.postItem
);
router.get(
  "/getLostItems/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  itemcontroller.getLostItems
);
router.get(
  "/getFoundItems/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  itemcontroller.getFoundItems
);

router.delete("/delete/:itemId", itemcontroller.deleteItem);

router.put(
  "/claim/:itemId/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  itemcontroller.claimItem
);

router.put(
  "/unclaim/:itemId/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  itemcontroller.unClaimItem
);

module.exports = router;
