const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Movie = require("../models/movie.model");

const findAllMovies = async (query) => {
  let { status, title, genres, artists, start_date, end_date } = query;
  let filter = {};
  if (status) {
    status == "PUBLISHED"
      ? (filter.published = true)
      : status == "RELEASED"
      ? (filter.released = true)
      : {};
  }
  if (title) filter.title = { $regex: title, $options: "i" };
  if (genres) filter.genres = { $all: genres.split(",") };
  if (artists) {
    const artistList = artists.split(",").map((artist) => {
      const [first_name, last_name] = artist.split(" ");
      return {
        "artists.first_name": { $regex: first_name, $options: "i" },
        "artists.last_name": { $regex: last_name, $options: "i" },
      };
    });
    filter.$or = artistList;
  }

  let movies = await Movie.find(filter);

  movies = movies.filter((movie) => {
    let result = false;
    if (start_date || end_date) {
      if (start_date) {
        result = new Date(movie.release_date) >= new Date(start_date);
      } else {
        result = true;
      }
      if (end_date) {
        result = result && new Date(movie.release_date) <= new Date(end_date);
      }
    }
    return result;
  });

  return movies;
};

const findOne = (id) => {
  return Movie.findOne({ movieid: id });
};

const findShows = async (id) => {
  const shows = await Movie.findOne({ movieid: id }, { shows: 1, _id: 0 });
  return shows.shows;
};

module.exports = { findAllMovies, findOne, findShows };
