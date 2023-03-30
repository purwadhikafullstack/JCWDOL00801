const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const tenantRouter = require("./tenantRouter");
const paymentMethodRouter = require("./paymentMethodRouter");;
const propertyRouter = require("./propertyRouter");
const transactionRouter = require("./transactionRouter")
const roomRouter = require("./roomRouter")
module.exports = {
  userRouter,
  categoryRouter,
  tenantRouter,
  transactionRouter,
  roomRouter,
  propertyRouter,
  paymentMethodRouter,
};
