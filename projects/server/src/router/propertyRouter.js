const {propertyController} = require("../controller")
const route = require("express").Router();

route.post("/property/all", propertyController.getPropertyData);
route.post("/property/:id", propertyController.getProperties);

module.exports = route