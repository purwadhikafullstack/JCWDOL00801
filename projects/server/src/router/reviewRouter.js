const { reviewController } = require("../controller");
const route = require("express").Router();

route.get("/review/check", reviewController.checkReview);
route.get("/review/testi", reviewController.reviewTesti);

module.exports = route;
