const { encryptPassword, createToken } = require("../config/encrypt");
const { userModel } = require("../model");
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");

function generateOTP() {
  let length = 4,
    charset = "0123456789",
    otp = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    otp += charset.charAt(Math.floor(Math.random() * n));
  }
  return otp;
}

module.exports = {
  registerAcc: async (req, res) => {
    const otp = generateOTP();
    let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    try {
      let data = await userModel.findAll({
        where: {
          email: req.body.email,
        },
      });

      if (data.length > 0) {
        res.status(200).send({
          success: false,
          message: "The email has been registered",
        });
      } else {
        if (req.body.provider === "google.com") {
          let length = 21,
            charset =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*#?&",
            randomString = "";
          for (let i = 0, n = charset.length; i < length; ++i) {
            randomString += charset.charAt(Math.floor(Math.random() * n));
          }

          const encryptedPassword =
            req.body.provider !== "common"
              ? encryptPassword(randomString)
              : encryptPassword(req.body.password);
          let data1 = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: encryptedPassword,
            otp,
            expiredOtp: tomorrow,
            countOtp: 1,
            isVerified: 1,
            provider: req.body.provider,
          });
        } else {
          let length = 21,
            charset =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*#?&",
            randomString = "";
          for (let i = 0, n = charset.length; i < length; ++i) {
            randomString += charset.charAt(Math.floor(Math.random() * n));
          }

          const encryptedPassword =
            req.body.provider !== "common"
              ? encryptPassword(randomString)
              : encryptPassword(req.body.password);
          let data1 = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: encryptedPassword,
            otp,
            expiredOtp: tomorrow,
            countOtp: 1,
            provider: req.body.provider,
          });
          //nodemailer di sini
          transport.sendMail(
            {
              from: "Renthaven Admin",
              to: req.body.email,
              subject: "Account verification",
              html: `<div>
              <h3>Here's your OTP. Please login and input your OTP</h2>
              <h3>${otp}</h3>
              <a href="http://localhost:3000/verify"><p>Please click here to verify your OTP</p></a>
              
              </div>`,
            },
            (error, info) => {
              if (error) {
                return res.status(401).send(error);
              }
            }
          );
        }

        res.status(200).send({
          success: true,
          message: "Registration Success!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(501).send({
        success: false,
        message: "Database error",
      });
    }
  },
  checkDuplicate: async (req, res) => {
    try {
      let data = await userModel.findAll({
        where: {
          email: req.body.email,
        },
      });
      if (data.length > 0) {
        res.status(403).send({
          success: false,
          message: "The email has been registered",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Email has not been registered",
        });
      }
    } catch (error) {}
  },
  loginUser: async (req, res) => {
    try {
      const data = await userModel.findAll({
        where: {
          email: req.body.email,
        },
      });
      let token = createToken({
        ...data,
      });
      if (data.length > 0) {
        if (req.body.login != "common") {
          res.status(200).send({
            success: true,
            message: "Login successfull",
            result: data[0],
            token,
          });
        } else if (req.body.login == "common") {
          const checkPass = bcrypt.compareSync(
            req.body.password,
            data[0].password
          );
          if (checkPass) {
            res.status(200).send({
              success: true,
              message: "Login successfull",
              result: data[0],
              token,
            });
          } else {
            res.status(200).send({
              success: false,
              message: "Username or password invalid",
            });
          }
        } else {
          res.status(200).send({
            success: false,
            message: "Username or password invalid",
          });
        }
      } else {
        res.status(200).send({
          success: false,
          message: "Username or password invalid",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(501).send({
        success: false,
        message: "Database error",
        error,
      });
    }
  },
  keepLogin: async (req, res) => {
    try {
      const data = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      console.log(data[0].isVerified);
      let token = createToken({
        ...data,
      });
      console.log(req.decrypt);
      if (data.length > 0) {
        return res.status(200).send({
          success: true,
          result: data[0],
          token,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  verifyAcc: async (req, res) => {
    try {
      const { otp, phone } = req.body;
      console.log(req.decrypt);
      let user = await userModel.findOne({
        where: { email: req.decrypt.email },
      });
      console.log(user);

      if (user.otp !== otp && user.provider !== "google.com") {
        return res.status(400).send({
          success: false,
          message: "OTP is not correct.",
        });
      }
      const phoneNum = user.provider == "common" ? user.phone : phone;
      let userUpdate = await userModel.update(
        { isVerified: 1, phone: phoneNum },
        {
          where: { email: req.decrypt.email },
        }
      );
      res.status(200).send({
        success: true,
        message: "Your account is verified",
        userUpdate,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "An error occured while verifying account.",
        error,
      });
    }
  },
  sendOtp: async (req, res) => {
    let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const { email } = req.decrypt;

    try {
      let user = await userModel.findOne({ where: { email } });

      if (Date.now() > user.expiredOtp) {
        let updateUser = await userModel.update(
          {
            countOtp: 0,
          },
          { where: { email } }
        );
      }

      let updatedUser = await userModel.findOne({ where: { email } });

      if (updatedUser.countOtp < 5) {
        let otp = generateOTP();
        transport.sendMail(
          {
            from: "Renthaven Admin",
            to: email,
            subject: "Account verification",
            html: `<div>
            <h3>Here's your OTP. Please login and input your OTP</h2>
            <h3>${otp}</h3>
            <a href="http://localhost:3000/verify"><p>Please click here to verify your OTP</p></a>

          </div>`,
          },
          (error, info) => {
            if (error) {
              return res.status(401).send(error);
            }
          }
        );

        let userUpdate = await userModel.update(
          {
            otp,
            countOtp: updatedUser.countOtp + 1,
            expiredOtp: tomorrow,
          },
          { where: { email } }
        );

        return res.status(200).send({
          success: true,
          message: "OTP has been sent to your email.",
        });
      } else {
        return res.status(400).send({
          success: false,
          message:
            "You have reached the maximum number of OTP attempts for today.",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(501).send({
        success: false,
        message: "An error occurred while sending OTP.",
      });
    }
  },
  changePass: async (req, res) => {
    try {
      const { oldPass, password, email } = req.body;
      const data = await userModel.findAll({
        where: {
          email: email,
        },
      });
      if (data[0].provider !== "common") {
        return res.status(403).send({
          success: false,
          message: `We're sorry but you cannot change your password if you login with ${data[0].provider} account`,
        });
      }

      const check = bcrypt.compareSync(oldPass, data[0].password);
      console.log(check);

      if (check != false) {
        const pass = encryptPassword(password);
        const update = await userModel.update(
          { password: pass },
          {
            where: {
              email: email,
            },
          }
        );
        console.log(`update`, update);
        if (update) {
          return res.status(200).send({
            success: true,
            message: `Your password has been successfully changed`,
          });
        }
      } else {
        return res.status(403).send({
          success: false,
          message: `Your current password is incorrect`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  verifyResetPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findAll({ where: { email } });

      if (!user[0]) {
        return res.status(404).send({
          success: false,
          message: "Email not found.",
        });
      }

      if (user[0].provider !== "common") {
        return res.status(403).send({
          success: false,
          message: `You are registering with ${user.provider}, you cannot change your password.`,
        });
      }

      let token = createToken({ ...user });
      let resetUrl = `http://localhost:3000/user/reset-password/new?t=${token}`;
      transport.sendMail(
        {
          from: "Renthaven Admin",
          to: email,
          subject: "Reset Password",
          html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
        },
        (error, info) => {
          if (error) {
            return res.status(401).send(error);
          }
        }
      );

      return res.status(200).send({
        success: true,
        message: "Reset password email sent",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "An error occurred while resetting password.",
        error,
      });
    }
  },
  resetPassword: async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { email } = req.decrypt;
    try {
      if (password !== confirmPassword) {
        return res.status(401).send({
          success: false,
          message: "Your password does not match",
        });
      }

      const pass = encryptPassword(password);
      let user = userModel.update({ password: pass }, { where: { email } });
      return res.status(200).send({
        success: true,
        message: "Password has been successfully changed. ",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while changing password.",
      });
    }
  },
};
