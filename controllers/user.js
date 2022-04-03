const User = require("../models/user");
const {check,validationResult} = require("express-validator");


exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User doesn't exist",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUserByRoll = (req, res, next, id) => {
  User.find({ roll: id }).exec((err, user) => {
    if (err || user.length===0) {
      return res.status(400).json({
        error: "User doesn't exist",
      });
    }
    req.cert = user[0];
    next();
  });
};


exports.updateUser = (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  console.log(req.body);

  User.findByIdAndUpdate(req.body._id,req.body,
    (user, err) => {
      console.log(user);
      res.json({
        name: user.name,
        email: user.email,
        id: user._id,
      });
    }
  );
};