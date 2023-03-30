const userController = require("./userController");
const categoryController = require("./categoryController");
const tenantController = require("./tenantController");
const paymentMethodController = require("./paymentMethodController");;
const propertyController = require("./propertyController");
const transactionController = require("./transactionController")
const roomController = require("./roomController")
module.exports = {
  userController,
  categoryController,
  tenantController,
  transactionController,
  roomController,
  propertyController,
  paymentMethodController,
};
