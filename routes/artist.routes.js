const express = require("express");
const router = express.Router();
const { findAllArtists } = require("../controllers/artist.controller");

router.get("/", async (req, res, next) => {
  try {
    const artists = { artists: await findAllArtists() };
    res.status(200).send(artists);
  } catch (error) {
    // Handle error and return error message
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
