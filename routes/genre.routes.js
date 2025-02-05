const express = require("express");
const router = express.Router();
const { findAllGenres } = require("../controllers/genre.controller");

router.get("/", async (req, res) => {
  try {
    const genres = { genres: await findAllGenres() };
    res.status(200).send(genres);
  } catch (error) {
    // Handle error and return error message
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
