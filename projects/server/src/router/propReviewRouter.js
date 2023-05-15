const route = require("express").Router();
const { tokenVerify } = require("../config/encrypt");
const { searchController, propReviewsController } = require("../controller")

route.get("/reviews/all", propReviewsController.getReviews);
route.post("/reviews/new", tokenVerify, propReviewsController.createReview);
route.get("/reviews/check", propReviewsController.checkReviews);
route.patch("/reviews/update", propReviewsController.updateReview);

module.exports = route