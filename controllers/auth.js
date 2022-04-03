const User = require("../models/user");
const {check,validationResult} = require("express-validator");
const env = require('dotenv');
const jwt= require("jsonwebtoken");
const expressJwt=require("express-jwt");

exports.signup = (req,res)=>{
    const errors = validationResult(req);
    console.log(errors);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    console.log(req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "Unable to create user Invalid credentials.",
          });
        }
        res.json({
          name: user.name,
          email: user.email,
          id: user._id,
        });
      });
};

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: "User doesn't exist",
      });
    }
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User doesnot exist",
        });
      }
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "Username or password invalid",
        });
      }
      //create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie
      res.cookie("token", token, {
        expire: new Date() + 10,
      });
      //send response to front end
      let error = "man";
      const { _id, name, email, role, phone } = user;
      console.log(user);
      return res.json({ token, user: { _id, name, email, role, phone }, error });
    });
  };

  exports.signout = (req, res) => {
    res.clearCookie("token");
    console.log("user signout ")
    res.json({
      message: "User Signout Successful",
    });
  };
  
  exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms:['HS256'],
    userProperty: "auth",
  });


  exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
      return res.status(403).json({
        error: "ACCESS DENIED",
      });
    }
    next();
  };


  exports.isAdmin = (req, res, next) => {
    // if (req.profile.role !== 2) {
    //   return res.status(403).json({
    //     error: "ACCESS DENIED",
    //   });
    // }
    next();
  };

  exports.isSeller = (req, res, next) => {
    if (req.profile.role === 0) {
      return res.status(403).json({
        error: "ACCESS DENIED",
      });
    }
    next();
  };
  
  
  