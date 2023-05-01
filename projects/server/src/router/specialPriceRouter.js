const { specialPriceController } = require("../controller");
const route = require("express").Router();

route.get("/special-price/all", specialPriceController.getSpecialPrice);
route.post("/special-price/add", specialPriceController.addSpecialPrice);
route.patch("/special-price/delete", specialPriceController.deleteSpecialPrice);

module.exports = route;