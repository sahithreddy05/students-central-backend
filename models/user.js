const mongoose = require("mongoose");

const crypto = require("crypto");

const {v1:uuidv1} = require("uuid");

var Schema = mongoose.Schema;
// mongoose.connect("mongodb://localhost:27017/test",{   
//   useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false, 
// })
// .catch(function(err){
//   console.log(err);
// });

var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 10,
      minlength: 10,
    },
    roll: {
      type: String,
      required: true,
      maxlength: 10,
      minlength: 10,
      trim: true,
      unique: true,
    },
    role: {
      type: Number,
      default: 0,
      required:true
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    orders: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

const usermodel = mongoose.model("user",userSchema)
module.exports= usermodel;

// (async function createUser(){
// let user={
//     name:"sahit",
//     email:"sahithreddy0501@outlook.com",
//     password:"sahith123",
//     phone:"9876543210",
//     roll:"18h51a05g5",
//     role:2
//   };
//  let userobj = await usermodel.create(user);
//  console.log(userobj);
// })();

