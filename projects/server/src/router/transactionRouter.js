const { tokenVerify } = require("../config/encrypt");
const { transactionController } = require("../controller");
const route = require("express").Router();

route.post("/transaction-detail", transactionController.getNecessaryData);
route.post("/transaction-new", tokenVerify, transactionController.createTransaction);

module.exports = route