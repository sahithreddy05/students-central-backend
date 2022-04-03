var express = require("express");
var router = express.Router();

const usercontroller = require("../controllers/user");
const authcontroller = require("../controllers/auth");
const fooditemcontroller = require("../controllers/foodItem");

router.param("userId", usercontroller.getUserById);
router.param("foodItemId", fooditemcontroller.getFoodItemById);

router.post(
  "/postItem/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isSeller,
  fooditemcontroller.postItem
);

router.get(
  "/getall/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  fooditemcontroller.getFoodItems
);

router.put(
  "/updateavailability/:userId/:foodItemId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isSeller,
  fooditemcontroller.changeAvailability
);

router.put(
  "/resettime/:userId/:foodItemId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isSeller,
  fooditemcontroller.resetDeliveryTime
);


module.exports = router;
