const route = require("express").Router();
const { paymentMethodController } = require("../controller");

route.get("/payment", paymentMethodController.getData);

module.exports = route;
