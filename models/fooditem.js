const mongoose = require("mongoose");

const foodItemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  available: {
    required: true,
    type: Boolean,
    default: true,
  },
  delivery_time: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  orders: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("foodItem", foodItemSchema);
