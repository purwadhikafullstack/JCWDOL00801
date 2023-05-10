const path = require("path")
require("dotenv").config({path: path.resolve(__dirname, "../.env")})
process.env.TZ = "Asia/Jakarta";
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");
const express = require("express");
const cors = require("cors");
const bearer = require("express-bearer-token");
const { join } = require("path");
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.static("src/public"));
app.use(cors());
app.use(bearer());
app.use(
  cors({
    origin: [process.env.WHITELISTED_DOMAIN && process.env.WHITELISTED_DOMAIN.split(",")],
  })
);

app.use(express.json());

//#region API ROUTES

// ===========================
// NOTE : Add your routes here
const {
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
} = require("./router");
const { dbSequelize, dbCheckConnection } = require("./config/db");
const { transactionController } = require("./controller");
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", tenantRouter);
app.use("/api", propertyRouter);
app.use("/api", transactionRouter);
app.use("/api", roomRouter);
app.use("/api", paymentMethodRouter);
app.use("/api", orderListRouter);
app.use("/api", userOderRouter);
app.use("/api", reviewRouter);
app.use("/api", searchRouter);
app.use("/api", propReviewRouter);
app.use("/api", roomAvailabilityRouter);
app.use("/api", specialPriceRouter);

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
transactionController.changeStatus();
// dbSequelize.sync();
dbCheckConnection();
