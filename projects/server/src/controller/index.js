const userController = require("./userController");
const categoryController = require("./categoryController");
const tenantController = require("./tenantController");
const paymentMethodController = require("./paymentMethodController");
const propertyController = require("./propertyController");
const transactionController = require("./transactionController");
const roomController = require("./roomController");
const orderListController = require("./orderListController");
const userOrderController = require("./userOrderController");
const reviewController = require("./reviewController");
const searchController = require("./searchController");
const propReviewsController = require("./propReviewsController")
module.exports = {
  userController,
  categoryController,
  tenantController,
  transactionController,
  roomController,
  propertyController,
  paymentMethodController,
  orderListController,
  searchController,
  propReviewsController,
  userOrderController,
  reviewController
};
