const { tokenVerify } = require("../config/encrypt");
const {uploader2} = require("../config/uploader2");
const route = require("express").Router();
const { tenantController } = require("../controller");


route.post("/signup/new-tenant", uploader2("/ktpImg", "IMGKTP").array('images', 1), tenantController.registerTenant);
route.post("/tenant/properties", tokenVerify, tenantController.getPropertyData)
route.post("/tenant/transaction", tokenVerify, tenantController.getTransaction)

module.exports = route