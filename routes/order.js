var express = require("express");
var router = express.Router();

const usercontroller = require("../controllers/user");
const authcontroller = require("../controllers/auth");
const orderControllers = require("../controllers/order");

router.param("userId", usercontroller.getUserById);
router.param("orderId", orderControllers.getItemById);

router.put(
  "/markdelivered/:userId/:orderId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isSeller,
  orderControllers.updateOrder
);

router.get(
  "/getallorders/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  orderControllers.getOrdersOfUser
);

router.get(
  "/getindorder/:userId/:orderId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isSeller,
  orderControllers.getIndividualOrder
);

router.get(
  "/getalltheorders/:userId",
  authcontroller.isSignedIn,
  authcontroller.isAuthenticated,
  authcontroller.isSeller,
  orderControllers.getAllOrders
);

module.exports = router;
