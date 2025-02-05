const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  artistid: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  wiki_url: { type: String, required: true },
  profile_url: { type: String, required: true },
  movies: { type: [String], default: [] },
});

const artists = mongoose.model("artists", artistSchema);

module.exports = artists;
