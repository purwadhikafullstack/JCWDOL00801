const { encryptPassword, createToken } = require("../config/encrypt");
const { userModel } = require("../model");
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");
const { where } = require("sequelize");

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
    console.log(req.body.regis);
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
        let length = 21,
          charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*#?&",
          randomString = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
          randomString += charset.charAt(Math.floor(Math.random() * n));
        }
        const otp = generateOTP();
        let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        const encryptedPassword =
          req.body.regis == "firebase"
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
        });
        //nodemailer di sini
        transport.sendMail(
          {
            from: "Renthaven Admin",
            to: req.body.email,
            subject: "Account verification",
            html: `<div>
          <h2>Here's your OTP. Please login and input your OTP</h2>
          <h3>${otp}</h3>
          
          </div>`,
          },
          (error, info) => {
            if (error) {
              return res.status(401).send(error);
            }
            return res.status(200).send({
              success: true,
              message: "Account successfully registered.",
              user: newUser,
            });
          }
        );
        res.status(200).send({
          success: true,
          message: "Registration Success!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(501).send({
        success: false,
        message: req.body.name,
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
        res.status(200).send({
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
        login: req.body.login,
      });
      if (data.length > 0) {
        if (req.body.login == "firebase") {
          res.status(200).send({
            success: true,
            message: "Login successfull",
            result: data[0],
            token,
          });
        } else if (req.body.login != "firebase") {
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
            res.status(403).send({
              success: false,
              message: "Username or password invalid",
            });
          }
        } else {
          res.status(403).send({
            success: false,
            message: "Username or password invalid",
          });
        }
      } else {
        res.status(403).send({
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
  verifyAcc: async (req, res) => {
    try {
      // read token user logging in
      // update user
      const { otp } = req.body;
      console.log(req.decrypt);
      let user = await userModel.findOne({
        where: { email: req.decrypt.email },
      });
      console.log(user);

      if (user.otp !== otp) {
        return res.status(400).send({
          success: false,
          message: "OTP is not correct.",
        });
      }

      let userUpdate = await userModel.update(
        { isVerified: 1 },
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
      let user = await userModel.findOne({
        where: { email },
      });
      if (new Date() < user.expiredOtp) {
        if (user.countOtp < 5) {
          let otp = generateOTP();
          transport.sendMail(
            {
              from: "Renthaven Admin",
              to: email,
              subject: "Account verification",
              html: `<div>
            <h2>Here's your OTP. </h2>
            <h3>${otp}</h3>
            
            </div>`,
            },
            (error, info) => {
              if (error) {
                return res.status(401).send(error);
              }
              return res.status(200).send({
                success: true,
                message: "Account successfully registered.",
                user: newUser,
              });
            }
          );

          let userUpdate = await userModel.update(
            {
              otp,
              countOtp: user.countOtp + 1,
              expiredOtp: tomorrow,
            },
            { where: { email } }
          );
        } else {
          return res.status(400).send({
            success: false,
            message: "You have reached the maximum number of OTP attempts.",
          });
        }
      } else {
        let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        if (new Date().getDate() !== tomorrow) {
          let user = await userModel.update({ countOtp: 0 }, { where: email });
        }
      }
      return res.status(200).send({
        success: true,
        message: "OTP has been sent to your email.",
        user,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "An error occured while sending OTP.",
        error,
      });
    }
  },
};
