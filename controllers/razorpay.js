const Razorpay = require("razorpay");
const shortid = require("shortid");
const crypto = require("crypto");
const env = require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.Rpay_keyId,
  key_secret: process.env.Rpay_keySecret,
});

exports.createOrderId = async (req, res) => {
  const payment_capture = 1;
  const amount = req.body.sum;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    console.log(options.receipt);
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      receipt: response.receipt,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyRpay = (req, res, next) => {
  // do a validation

  console.log(req.body);

  const shasum = crypto.createHmac("sha256", process.env.Rpay_secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("body");
    console.log(req.body.payload.payment.entity);
    req.order = {
      oid: req.body.payload.payment.entity.id,
      des: req.body.payload.payment.entity.description,
    };
    next();
  }
  res.json({ status: "ok" });
};
