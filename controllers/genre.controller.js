const express = require("express");
const app = express();
const mongoose = require("mongoose");
const genres = require("../models/genre.model");

const findAllGenres = () => {
  return genres.find();
};

module.exports = { findAllGenres };
