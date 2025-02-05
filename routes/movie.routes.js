const express = require("express");
const router = express.Router();
const {
  findAllMovies,
  findOne,
  findShows,
} = require("../controllers/movie.controller");

router.get("/:movieId", async (req, res, next) => {
  try {
    const movie = await findOne(req.params.movieId);
    res.status(200).json(movie);
  } catch (error) {
    // Handle error and return error message
    res.status(500).json({ error: error.message });
  }
});

router.get("/:movieId/shows", async (req, res, next) => {
  try {
    const shows = await findShows(req.params.movieId);
    res.status(200).json(shows);
  } catch (error) {
    // Handle error and return error message
    res.status(500).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const movies = { movies: await findAllMovies(req.query) };
    return res.status(200).json(movies);
  } catch (error) {
    // Handle error and return error message
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const movies = { movies: await findAllMovies("") };
    res.status(200).json(movies);
  } catch (error) {
    // Handle error and return error message
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
