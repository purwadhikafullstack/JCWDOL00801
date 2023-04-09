const route = require("express").Router();
const { searchController } = require("../controller")

route.post("/search", searchController.getData);

module.exports = route