const { tokenVerify } = require("../config/encrypt");
const { orderListController } = require("../controller");
const route = require("express").Router();

route.get("/orderlist", orderListController.getData);
route.patch("/orderlist/update", orderListController.update);
route.patch("/orderlist/cancel", orderListController.cancelTenant);
route.get("/orderlist/tenant-chart", tokenVerify, orderListController.getTenantLineChart);

module.exports = route;
