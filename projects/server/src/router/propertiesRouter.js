const { tokenVerify } = require("../config/encrypt");
const { checkUser } = require("../config/validator");
const { userController, propertiesController } = require("../controller");
const route = require("express").Router();

route.get("/property", propertiesController.getProperties);

module.exports = route;
