const { tokenVerify } = require("../config/encrypt");
const { orderListController } = require("../controller");
const route = require("express").Router();

route.get("/orderlist", orderListController.getData);
route.patch("/orderlist/update", orderListController.update);
route.patch("/orderlist/cancel", orderListController.cancelTenant);
route.patch("/orderlist-user/cancel", tokenVerify, orderListController.cancelOrder);

module.exports = route;
