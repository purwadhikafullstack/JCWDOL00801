const route = require("express").Router();
const { categoryController } = require("../controller");

route.post("/category/regis", categoryController.regis);
route.get("/category/:tenantId", categoryController.getData);
route.get("/category", categoryController.getAllData);

module.exports = route;
