const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const tenantRouter = require("./tenantRouter");
const paymentMethodRouter = require("./paymentMethodRouter");
const transactionRouter = require("./transactionRouter");
const roomRouter = require("./roomRouter");
const propertyRouter = require("./propertyRouter");
const orderListRouter = require("./orderListRouter");
const userOderRouter = require("./userOrderRouter");
const reviewRouter = require("./reviewRouter");
const searchRouter = require("./searchRouter");
const roomAvailabilityRouter = require("./roomAvailabilityRouter");
const specialPriceRouter = require("./specialPriceRouter");

module.exports = {
  userRouter,
  categoryRouter,
  tenantRouter,
  transactionRouter,
  roomRouter,
  propertyRouter,
  paymentMethodRouter,
  orderListRouter,
  userOderRouter,
  reviewRouter,
  searchRouter,
  roomAvailabilityRouter,
  specialPriceRouter
};
