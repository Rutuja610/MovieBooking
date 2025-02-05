const User = require("../models/user.model");
const Movie = require("../models/movie.model");
const uuidTokenGenerator = require("uuid-token-generator");
const { v4: uuidv4 } = require("uuid");
const b2a = require("b2a");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/db.config");

const signUp = async (req, res) => {
  try {
    const { email_address, first_name, last_name, mobile_number, password } =
      req.body;
    const existingUser = await User.findOne({ email: email_address });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const userid = (await User.find()).length + 1;
    const role = "user";
    const newUser = new User({
      userid,
      email: email_address,
      first_name,
      last_name,
      username: first_name + " " + last_name,
      contact: mobile_number,
      password: password,
      role,
      isLoggedIn: false,
      uuid: "",
      accesstoken: "",
      coupens: [],
      bookingRequests: [],
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};
const login = async (req, res) => {
  try {
    let authorization = req.headers.authorization;
    let userdetail = b2a.atob(authorization.split(" ")[1]);
    const email = userdetail.split(":")[0];
    const password = userdetail.split(":")[1];

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const uuid = uuidv4();
    const tokgen = new uuidTokenGenerator(256, uuidTokenGenerator.BASE62);
    const token = tokgen.generate();

    const encodedUsername = b2a.btoa(user.username);
    const encodedPassword = b2a.btoa(password);

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        uuid,
        encodedUsername,
        encodedPassword,
      },
      secretKey
    );

    // Update user login status
    user.isLoggedIn = true;
    user.uuid = uuid;
    user.accesstoken = token;
    await user.save();
    res.setHeader("access-token", jwtToken);
    return res.status(200).json({
      message: "Login successful",
      id: uuid,
      "access-token": jwtToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update user login status
    user.isLoggedIn = false;
    user.accesstoken = "";
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

const getCouponCode = async (req, res) => {
  try {
    let authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    await jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return;
      }
      const email = decoded.email;
      const coupons = await User.findOne(
        { email: email },
        { coupens: 1, _id: 0 }
      );
      let coupen = coupons.coupens.filter(
        (coupen) => coupen.id === parseInt(req.query.code)
      );
      if (coupen.length === 0) {
        return res.status(400).json({ error: "Not a valid Coupon" });
      }
      res.status(200).json({ discountValue: coupen[0].discountValue });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Coupons", error: error.message });
  }
};

const bookings = async (req, res) => {
  try {
    let authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    await jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return;
      }
      const email = decoded.email;
      let user = await User.findOne({ email: email });
      const { bookingRequest } = req.body;
      const shows = await Movie.findOne(
        {
          "shows.id": bookingRequest.show_id,
        },
        { shows: 1 }
      );

      let show = shows.shows.filter(
        (show) => show.id == bookingRequest.show_id
      );
      if (show.length == 0) {
        return res.status(400).json({ error: "Invalid Show ID" });
      }
      bookingRequest.reference_number = user.bookingRequests.length + 1;
      user.bookingRequests.push(bookingRequest);
      await user.save();

      show[0].available_seats =
        show[0].available_seats - bookingRequest.tickets[0];
      await shows.save();
      res
        .status(201)
        .json({ reference_number: bookingRequest.reference_number });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Booking Tickets", error: error.message });
  }
};

module.exports = { login, signUp, logout, getCouponCode, bookings };
