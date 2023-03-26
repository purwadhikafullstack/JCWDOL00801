const { transactionController } = require("../controller");
const route = require("express").Router();

route.post("/transaction-detail", transactionController.getNecessaryData);

module.exports = route