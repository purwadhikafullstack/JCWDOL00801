const route = require("express").Router();
const { searchController, propReviewsController } = require("../controller")

route.get("/reviews/all", propReviewsController.getReviews);
route.post("/reviews/new", propReviewsController.createReview);

module.exports = route