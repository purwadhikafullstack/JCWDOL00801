const { tokenVerify } = require("../config/encrypt");
const { checkUser } = require("../config/validator");
const { userController } = require("../controller");
const { registerAcc, checkDuplicate, loginUser } = require("../controller/");
const route = require("express").Router();

route.post("/signup/new-user", checkUser, userController.registerAcc);
route.post("/signup/user", userController.checkDuplicate);
route.post("/signin/", userController.loginUser);
route.post("/verify", tokenVerify, userController.verifyAcc);
route.post("/sendotp", tokenVerify, userController.sendOtp);

module.exports = route;
