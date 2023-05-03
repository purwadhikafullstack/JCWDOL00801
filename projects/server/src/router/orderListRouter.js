const route = require("express").Router();
const { tokenVerify } = require("../config/encrypt");
const { orderListController } = require("../controller");

route.get("/orderlist", orderListController.getData);
route.patch("/orderlist/update", orderListController.update);
route.patch("/orderlist/cancel", orderListController.cancelTenant);
route.get("/orderlist/chart", orderListController.getDataForChart);
route.get("/orderlist/user", tokenVerify, orderListController.getUserForChart);

module.exports = route;
