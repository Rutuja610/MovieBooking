const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { DB_URL } = require("./config/db.config");
const PORT = 8085;
const movieRoutes = require("./routes/movie.routes");
const genreRoutes = require("./routes/genre.routes");
const artistRoutes = require("./routes/artist.routes");
const userRoutes = require("./routes/user.routes");

app.use(cors());
app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/auth", userRoutes);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Cannot connect to the database!", err);
    process.exit(1); // Exit the process with an error code
  });

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Upgrad Movie booking application development.",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
