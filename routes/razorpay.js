var express = require("express");
var router = express.Router();

const razorpayControllers = require("../controllers/razorpay");
const usercontroller = require("../controllers/user");
const orderControllers=require("../controllers/order")

router.param("userId", usercontroller.getUserById);
router.post("/razorpay/:userId", razorpayControllers.createOrderId);
router.post("/verification", razorpayControllers.verifyRpay,orderControllers.createOrder);

module.exports = router;
