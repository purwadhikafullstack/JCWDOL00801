const { reviewController } = require("../controller");
const route = require("express").Router();

route.get("/review/check", reviewController.checkReview);

module.exports = route;
