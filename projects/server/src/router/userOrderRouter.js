const { userOrderController } = require("../controller");
const route = require("express").Router();

route.get("/user-order", userOrderController.getData);

module.exports = route;
