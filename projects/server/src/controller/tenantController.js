const { encryptPassword, createToken } = require("../config/encrypt");
const {
  tenantModel,
  userModel,
  propertyModel,
  transactionModel,
  paymentMethodModel,
} = require("../model");
const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");
const { dbSequelize } = require("../config/db");

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
  registerTenant: async (req, res) => {
    try {
      const otp = generateOTP();
      let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const { email, password, name, phone, noKtp, ktpImg } = req.body;
      const data = await userModel.findAll({
        where: {
          email,
        },
      });
      const dataTenant = await tenantModel.findAll({
        where: {
          noKtp,
        },
      });
      if (data.length > 0) {
        return res.status(403).send({
          success: false,
          message: "Email had already been registered",
        });
      } else if (dataTenant.length > 0) {
        return res.status(403).send({
          success: false,
          message: "KTP / ID card number had been registered",
        });
      } else {
        const encryptedPassword = encryptPassword(password);
        const data1 = await userModel.create({
          name: name,
          email: email,
          phone: phone,
          password: encryptedPassword,
          otp,
          expiredOtp: tomorrow,
          countOtp: 1,
          provider: "common",
          role: "tenant",
        });
        const data2 = await userModel.findOne({
          where: {
            email: email,
          },
        });
        const data3 = await tenantModel.create({
          userId: data2.userId,
          noKtp: noKtp,
          ktpImg: `/ktpImage/${req.files[0].filename}`,
        });
        transport.sendMail(
          {
            from: "Renthaven Admin",
            to: email,
            subject: "Tenant Account Verification",
            html: `<div>
                      <h5>Here's your OTP. Please login and input your OTP</h5>
                      <h3>${otp}</h3>
                      <a href="http://localhost:3000/tenant/verify"><p>Please click here to verify your OTP</p></a>
                      </div>`,
          },
          (error, info) => {
            if (error) {
              return res.status(401).send(error);
            }
          }
        );
        return res.status(200).send({
          success: true,
          message: "Tenant account created",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  loginTenant: async (req, res) => {
    try {
      const data = await userModel.findAll({
        where: {
          email: req.body.email,
        },
      });
      const tenantData = await tenantModel.findAll({
        include: {
          model: userModel,
          as: "user",
          required: true,
        },
        where: { userId: data[0].userId },
      });
      const bankData = await paymentMethodModel.findAll({
        where: { bankId: tenantData[0].bankId },
      });
      let token = createToken({
        ...data,
      });
      if (data.length > 0) {
        if (data[0].role === "user") {
          return res.status(403).send({
            success: false,
            message: "The account is not a tenant, please login by using your tenant account",
          });
        }
        const checkPass = bcrypt.compareSync(req.body.password, data[0].password);
        if (checkPass) {
          res.status(200).send({
            success: true,
            message: "Login successfull",
            user: data[0],
            tenant: tenantData[0],
            bank: bankData[0],
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
    } catch (error) {
      console.log(error);
      res.status(501).send({
        success: false,
        message: "Database error",
        error,
      });
    }
  },
  getPropertyData: async (req, res) => {
    try {
      const data = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const data1 = await tenantModel.findAll({
        where: {
          userId: data[0].userId,
        },
      });
      const data2 = await propertyModel.findAll({
        where: {
          tenantId: data1[0].tenantId,
        },
      });
      return res.status(200).send({
        success: true,
        result: data2,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  getTransaction: async (req, res) => {
    try {
      const data = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const data0 = await tenantModel.findAll({
        where: {
          userId: data[0].userId,
        },
      });
      let data2 = await dbSequelize.query(
        `SELECT t.transactionId, t.payProofImg, u.name as guestName, ty.name, t.status from transactions as t INNER JOIN users as u on t.userId = u.userId
            INNER JOIN orderlists as o on t.transactionId = o.transactionId INNER JOIN rooms as r on o.roomId = r.roomId INNER JOIN types as ty on r.typeId = ty.typeId 
            INNER JOIN properties as p on r.propertyId = p.propertyId INNER JOIN tenants as ten on p.tenantId = ten.tenantId where ten.tenantId = ${data0[0].tenantId};`,
        { type: QueryTypes.SELECT }
      );
      return res.status(200).send({
        success: true,
        result: data2,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  update: async (req, res) => {
    try {
      const { bankId, bankAccountNum, tenantId } = req.body;

      const data = await tenantModel.findAll({ where: { tenantId } });

      const bankIdField = bankId || bankId !== "" ? bankId : data[0].bankId;
      const bankAccField =
        bankAccountNum || bankAccountNum !== "" ? bankAccountNum : data[0].bankAccountNum;

      let update = await tenantModel.update(
        { bankId: bankIdField, bankAccountNum: bankAccField },
        { where: { tenantId } }
      );

      if (update) {
        return res.status(200).send({
          success: true,
          message: `Bank Information Successfully Updated`,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
