const {
    encryptPassword,
    createToken
  } = require("../config/encrypt");
  const {
    userModel,
    transactionModel,
    orderListModel,
    roomAvailModel,
    specialPriceModel
  } = require("../model");
  const bcrypt = require("bcrypt");
  const {
    transport
  } = require("../config/nodemailer");
const { dbSequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");

module.exports = {
    getNecessaryData: async (req, res) =>{
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
    createTransaction: async (req, res) =>{
      try {
        const { specialReq,totalGuest, checkinDate, checkoutDate, price, bankId, bankAccountNum, propertyId} = req.body;
        const {userId} = req.decrypt;
        console.log(userId)
        const newCheckinDate = checkinDate.toString().slice(0, -1).slice(0, 19).replace('T', ' ')
        const newCheckoutDate = checkoutDate.toString().slice(0, -1).slice(0, 19).replace('T', ' ')
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
        `, {type: QueryTypes.SELECT})
        if(data.length < 1){
          return res.status(401).send({
            success: false,
            message: "The room has already been booked"
          })
        }
        let randomRoomId = Math.floor( Math.random() * data.length)
        const data0 = await transactionModel.create({
          userId,
          specialReq,
          totalGuest,
          checkinDate: newCheckinDate,
          checkoutDate: newCheckoutDate,
          bankId,
          bankAccountNum
        })
        const transactionId = data0.transactionId
        const data1 = await orderListModel.create({
          transactionId,
          roomId : data[randomRoomId].roomId,
          price
        })
        const data2 = await roomAvailModel.create({
          roomId: data[randomRoomId].roomId,
          startDate: newCheckinDate,
          endDate: newCheckoutDate
        })
         console.log(data)
         res.status(200).send({
          success:true,
          result: data0
         })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          success: false,
          message: "database error"
        })
      }
    }
}