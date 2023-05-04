const route = require("express").Router();
const { tokenVerify } = require("../config/encrypt");
const { paymentMethodController } = require("../controller");

route.get("/payment", paymentMethodController.getData);
route.get("/payment/check",tokenVerify, paymentMethodController.checkData);

module.exports = route;
