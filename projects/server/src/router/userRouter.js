const { tokenVerify } = require("../config/encrypt");
const { checkUser } = require("../config/validator");
const { uploader } = require("../config/uploader");
const { userController, tenantController } = require("../controller");
const route = require("express").Router();

route.post("/signup/new-user", checkUser, userController.registerAcc);
route.post("/signup/user", userController.checkDuplicate);
route.post("/signin/", userController.loginUser);
route.post("/signin/tenant", tenantController.loginTenant);
route.post("/signin/keep-login", tokenVerify, userController.keepLogin);
route.post("/verify", tokenVerify, userController.verifyAcc);
route.post("/sendotp", tokenVerify, userController.sendOtp);
route.patch("/user/change-password", checkUser, userController.changePass);
route.patch(
  "/profile",
  tokenVerify,
  uploader("/imgProfile", "IMGPROFILE").array("images", 1),
  userController.changeImgProfile
);
route.patch("/user", userController.update);
route.post("/user/change-email", userController.sendOtpOldEmail);
route.post("/user/verify-email", userController.verifyOtpOldEmail);
route.post(
  "/user/reset-password",
  checkUser,
  userController.verifyResetPassword
);
route.patch(
  "/user/reset-password",
  checkUser,
  tokenVerify,
  userController.resetPassword
);

module.exports = route;
