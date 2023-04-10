const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const tenantRouter = require("./tenantRouter");
const paymentMethodRouter = require("./paymentMethodRouter");;
const transactionRouter = require("./transactionRouter")
const roomRouter = require("./roomRouter");
const propertyRouter = require("./propertyRouter");
const orderListRouter = require("./orderListRouter");
const searchRouter = require("./searchRouter")
module.exports = {
  userRouter,
  categoryRouter,
  tenantRouter,
  transactionRouter,
  roomRouter,
  propertyRouter,
  paymentMethodRouter,
  orderListRouter,
  searchRouter
};
