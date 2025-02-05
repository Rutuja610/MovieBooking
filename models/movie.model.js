const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const genreSchema = require("./genre.model");
const artists = require("./artist.model");

const movieSchema = new Schema({
  movieid: { type: Number, required: true },
  title: { type: String, required: true },
  published: { type: Boolean, required: true },
  released: { type: Boolean, required: true },
  poster_url: { type: String, required: true },
  release_date: { type: Date, required: true },
  publish_date: { type: Date, required: true },
  artists: [{ type: Schema.Types.ObjectId, ref: "artists", require: true }],
  genres: [{ type: String, require: true }],
  duration: { type: Number, required: true },
  critic_rating: { type: Number, required: true },
  trailer_url: { type: String, required: true },
  wiki_url: { type: String, required: true },
  story_line: { type: String, required: true },
  shows: [
    {
      id: { type: Number, required: true },
      theatre: {
        name: { type: String, required: true },
        city: { type: String, required: true },
      },
      language: { type: String, required: true },
      show_timing: { type: Date, required: true },
      available_seats: { type: Number, required: true },
      unit_price: { type: Number, required: true },
    },
  ],
});

const Movie = mongoose.model("movies", movieSchema);

module.exports = Movie;
