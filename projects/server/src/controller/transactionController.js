const {
  encryptPassword,
  createToken
} = require("../config/encrypt");
const {
  userModel,
  transactionModel,
  orderListModel,
  roomAvailModel,
  specialPriceModel,
  tenantModel
} = require("../model");
const bcrypt = require("bcrypt");
const {
  transport
} = require("../config/nodemailer");
const {
  dbSequelize
} = require("../config/db");
const {
  QueryTypes,
  Op
} = require("sequelize");
const {
  format,
  addHours,
  addDays
} = require("date-fns")
const cron = require("cron")

module.exports = {
  getNecessaryData: async (req, res) => {
    try {
      const data = await dbSequelize.query(`select p.image, p.name, t.name as typeName, t.capacity, pay.bankId, pay.bankName, pay.bankLogo, ten.bankAccountNum as accountNum, t.price from properties as p INNER JOIN rooms as r on p.propertyId = r.propertyId
            INNER JOIN types as t on r.typeId = t.typeId INNER JOIN tenants as ten on p.tenantId = ten.tenantId INNER JOIN paymentmethods as pay on ten.bankId = pay.bankId where p.propertyId = ${req.query.id} and t.typeId = ${req.body.typeId}`, {
        type: QueryTypes.SELECT
      })
      // const data1 = await specialPriceModel.findAll()
      return res.status(200).send({
        success: true,
        result: data
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: "Database Error"
      })
    }
  },
  createTransaction: async (req, res) => {
    try {

      const {
        specialReq,
        totalGuest,
        checkinDate,
        checkoutDate,
        price,
        bankId,
        bankAccountNum,
        propertyId
      } = req.body;
      const {
        userId
      } = req.decrypt;
      console.log(userId)
      const date1 = new Date(checkinDate);
      const date2 = new Date(checkoutDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const newCheckinDate = format(new Date(), "yyyy-MM-dd HH:mm:ss")
      const newCheckoutDate = format(addDays(new Date(), diffDay), "yyyy-MM-dd HH:mm:ss")
      console.log("NEW CHECKIN AND CHECKOUT", newCheckinDate, newCheckoutDate)
      const data = await dbSequelize.query(`
        SELECT * from rooms as r WHERE r.roomId NOT IN (
          SELECT ra.roomId 
              FROM roomavailabilities AS ra
              WHERE 
                STR_TO_DATE("${newCheckinDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate 
                OR STR_TO_DATE("${newCheckoutDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate
                AND (
                  DATE_FORMAT(STR_TO_DATE("${newCheckinDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                  AND TIME_FORMAT("${newCheckinDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                  OR TIME_FORMAT("${newCheckinDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')
                )
                AND (
                  DATE_FORMAT(STR_TO_DATE("${newCheckoutDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                  AND TIME_FORMAT("${newCheckoutDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                  OR TIME_FORMAT("${newCheckoutDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')   
            )
        );
        `, {
        type: QueryTypes.SELECT
      })
      if (data.length < 1) {
        return res.status(401).send({
          success: false,
          message: "The room has already been booked"
        })
      }
      let randomRoomId = Math.floor(Math.random() * data.length)
      const data0 = await transactionModel.create({
        userId,
        specialReq,
        totalGuest,
        checkinDate: newCheckinDate,
        checkoutDate: newCheckoutDate,
        bankId,
        bankAccountNum,
        transactionExpired: format(addHours(new Date(), 2), "yyyy-MM-dd HH:mm:ss")
      })
      const transactionId = data0.transactionId
      const data1 = await orderListModel.create({
        transactionId,
        roomId: data[randomRoomId].roomId,
        price
      })
      console.log(data)
      res.status(200).send({
        success: true,
        result: data0
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: "database error"
      })
    }
  },
  getBankData: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email
        }
      })
      const transaction = await transactionModel.findAll({
        where: {
          [Op.and]: [{
            userId: user[0].userId,
            transactionId: req.query.id
          }]
        }
      })
      if (transaction.length > 0 && (new Date().getTime() < new Date(transaction[0].transactionExpired).getTime() || transaction[0].status !== "Cancelled")) {
        const data = await dbSequelize.query(`SELECT o.price, t.payProofImg, t.bankId,t.transactionExpired, pay.bankName, t.bankAccountNum
        FROM orderlists AS o
        INNER JOIN transactions AS t ON o.transactionId = t.transactionId
        INNER JOIN paymentMethods as pay ON t.bankId = pay.bankId
        WHERE t.transactionId = ${req.query.id}
        `, {
          type: QueryTypes.SELECT
        })
        return res.status(200).send({
          success: true,
          result: data
        })
      } else {
        return res.status(401).send({
          success: false,
          message: "Transaction Expired"
        })
      }

    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error"
      })
    }
  },
  uploadProof: async (req, res) => {

    try {
      const user = await userModel.findAll({
        where: {
          userId: req.decrypt.userId
        }
      })
      const order = await orderListModel.findAll({
        where: {
          transactionId: req.body.transactionId
        }
      })
      if (user.length > 0) {
        const data = await transactionModel.update({
          payProofImg: `/transactionProofImg/${req.files[0].filename}`,
          status: "Waiting for confirmation"
        }, {
          where: {
            transactionId: req.body.transactionId
          }
        })
        const transactions = await transactionModel.findAll({
          where:{
            transactionId: req.body.transactionId
          }
        })
        const data2 = await roomAvailModel.create({
          roomId: order[0].roomId,
          startDate: transactions[0].checkinDate,
          endDate: transactions[0].checkoutDate
        })
        res.status(200).send({
          success: true,
          message: "Proof Payment Image Uploaded"
        })
      } else {
        return res.status(401).send({
          success: false,
          message: "You are not allowed to do this transaction"
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error."
      })
    }
  },
  changeStatus: () => {
    const cron = require('cron');
    const job = new cron.CronJob('*/5 * * * * *', async function () {
      const transactions = await transactionModel.findAll({
        where: {
          status: 'Waiting for payment'
        }
      });
      for (const transaction of transactions) {
        const transactionExpired = new Date(transaction.transactionExpired);
        const now = new Date();
        if (transactionExpired < now) {
          await transaction.update({
            status: 'Cancelled'
          });
        }
      }
    });
    job.start();
  }
}