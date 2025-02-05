const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  genreid: { type: Number, require: true },
  genre: { type: String, require: true },
});

module.exports = mongoose.model("genres", genreSchema);
