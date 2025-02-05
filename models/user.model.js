const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Coupon Schema
const couponSchema = new Schema({
  id: { type: Number, required: true },
  discountValue: { type: Number, required: true },
});

// Booking Request Schema
const bookingRequestSchema = new Schema({
  reference_number: { type: Number, required: true },
  coupon_code: { type: Number, required: true },
  show_id: { type: Number, required: true },
  tickets: { type: [Number], required: true },
});

// User Schema
const userSchema = new Schema({
  userid: { type: Number, required: true },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  isLoggedIn: { type: Boolean, required: true },
  uuid: { type: String, default: "" },
  accesstoken: { type: String, default: "" },
  coupens: [couponSchema],
  bookingRequests: [bookingRequestSchema],
});

const User = mongoose.model("users", userSchema);
module.exports = User;
