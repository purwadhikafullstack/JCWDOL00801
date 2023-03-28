const { tokenVerify } = require("../config/encrypt");
const { uploader2 } = require("../config/uploader2");
const { transactionController } = require("../controller");
const route = require("express").Router();

route.post("/transaction-detail", transactionController.getNecessaryData);
route.get("/reload-status-transaction", transactionController.changeStatus);
route.post("/transaction-new", tokenVerify, transactionController.createTransaction);
route.post("/transaction/upload-proof",uploader2("/proofImg", "PRFIMG").array('images', 1), tokenVerify,  transactionController.uploadProof);
route.post("/transaction/find",tokenVerify, transactionController.getBankData);

module.exports = route