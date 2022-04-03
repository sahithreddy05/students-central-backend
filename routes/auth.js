const express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
// const {signin,signout,signup,isSignedIn,isAuthenticated,isAdmin}=require("../controllers/auth");
const authController = require("../controllers/auth");

const userController = require("../controllers/user");

router.param("userId", userController.getUserById);

router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "password is required").isLength({ min: 8 }),
  ],
  authController.signin
);
// /:userId

router.post(
  "/signup/:userId",
  [
    check("name", "name should be at least 3 characters long.").isLength({
      min: 3,
    }),
    check("email", "email is required").isEmail(),
    check(
      "password",
      "password should be at least 8 characters long."
    ).isLength({ min: 8 }),
  ],
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  authController.signup
);

router.get("/signout", authController.signout);
module.exports = router;
