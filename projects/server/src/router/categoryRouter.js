const route = require("express").Router();
const { categoryController } = require("../controller");

route.post("/category/regis", categoryController.regis);
route.get("/category/:tenantId", categoryController.getData);
route.get("/category", categoryController.getAllData);
route.patch("/category/update", categoryController.editData);
route.patch("/category/active/switch", categoryController.delete);
route.get("/category/for-create/:tenantId", categoryController.getDataForCreate);
module.exports = route;
