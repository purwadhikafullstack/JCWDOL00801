const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const tenantRouter = require("./tenantRouter");
const paymentMethodRouter = require("./paymentMethodRouter");
const transactionRouter = require("./transactionRouter");
const roomRouter = require("./roomRouter");
const propertyRouter = require("./propertyRouter");
const orderListRouter = require("./orderListRouter");
const searchRouter = require("./searchRouter");
const reviewRouter = require("./reviewRouter")
const propReviewRouter = require("./propReviewRouter");
const userOderRouter = require("./userOrderRouter");
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
  searchRouter,
  propReviewRouter,
  userOderRouter,
  reviewRouter,
  roomAvailabilityRouter,
  specialPriceRouter
};
