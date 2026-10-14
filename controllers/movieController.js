const Movie = require("../models/Movie");
const { renderMoviesList, renderMovieDetail } = require("../views/movieViews");

const wantsHtml = (req) =>
  req.query.format !== "json" &&
  req.headers.accept &&
  req.headers.accept.includes("text/html");

// @desc    Get all movies with search, filter, sort
// @route   GET /api/v1/movies
exports.getMovies = async (req, res) => {
  try {
    const { search, genre, sort } = req.query;

    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (genre && genre !== "All") query.genre = genre;

    let dbQuery = Movie.find(query);
    if (sort === "rating") dbQuery = dbQuery.sort({ rating: -1 });
    else if (sort === "year") dbQuery = dbQuery.sort({ year: -1 });

    const movies = await dbQuery;

    if (wantsHtml(req)) {
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
      return res.send(renderMoviesList(movies, baseUrl, req.query));
    }

    res.status(200).json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single movie details
// @route   GET /api/v1/movies/:id
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, error: "Movie not found" });
    }

    if (wantsHtml(req)) {
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
      return res.send(renderMovieDetail(movie, baseUrl));
    }

    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
