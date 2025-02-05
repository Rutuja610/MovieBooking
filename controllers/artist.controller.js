const express = require("express");
const app = express();
const mongoose = require("mongoose");
const artist = require("../models/artist.model");

const findAllArtists = () => {
  return artist.find();
};

module.exports = { findAllArtists };
