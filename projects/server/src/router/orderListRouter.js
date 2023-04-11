const { orderListController } = require("../controller");
const route = require("express").Router();

route.get("/orderlist", orderListController.getData);
route.patch("/orderlist/update", orderListController.update);
route.patch("/orderlist/cancel", orderListController.cancelTenant);

module.exports = route;
