const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  signUp,
  getCouponCode,
  bookings,
} = require("../controllers/user.controller");

router.post("/logout", (req, res) => {
  logout(req, res);
});

router.post("/login", (req, res) => {
  login(req, res);
});
router.post("/signup", (req, res) => {
  signUp(req, res);
});

router.get("/coupons", (req, res) => {
  getCouponCode(req, res);
});

router.post("/bookings", (req, res) => {
  bookings(req, res);
});

module.exports = router;
